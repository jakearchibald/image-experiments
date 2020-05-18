/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import imgURL from 'asset-url:./img.jpg';
import fragmentShaderSource from 'asset-string:./s.frag';
import vertexShaderSource from 'asset-string:./s.vert';

async function loadImage(url: string): Promise<ImageBitmap> {
  const blob = await fetch(url).then((r) => r.blob());
  return createImageBitmap(blob);
}

async function resizeToBounds(
  bmp: ImageBitmap,
  width: number,
  height: number,
): Promise<ImageBitmap> {
  if (bmp.width <= width && bmp.height <= height) return bmp;

  const imgRatio = bmp.width / bmp.height;
  const boundRatio = width / height;

  if (imgRatio > boundRatio) {
    return createImageBitmap(bmp, {
      resizeWidth: width,
      resizeQuality: 'high',
    });
  }

  return createImageBitmap(bmp, {
    resizeHeight: height,
    resizeQuality: 'high',
  });
}

function loadShader(
  gl: WebGLRenderingContext,
  source: string,
  type: GLenum,
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw Error(error || 'unknown error');
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  shaders: WebGLShader[],
): WebGLProgram {
  const program = gl.createProgram()!;
  for (const shader of shaders) gl.attachShader(program, shader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw Error(error || 'unknown error');
  }

  return program;
}

async function main(): Promise<void> {
  const bmp = await resizeToBounds(
    await loadImage(imgURL),
    window.innerWidth * devicePixelRatio,
    window.innerHeight * devicePixelRatio,
  );

  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const gl = canvas.getContext('webgl', {
    antialias: false,
    powerPreference: 'low-power',
  });

  if (!gl) throw Error(`Couldn't create GL context`);

  const frag = loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  const vert = loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const program = createProgram(gl, [frag, vert]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, 'a_position');

  // look up uniform locations
  //var u_imageLoc = gl.getUniformLocation(program, 'u_image');
  var u_matrixLoc = gl.getUniformLocation(program, 'u_matrix');

  // provide texture coordinates for the rectangle.
  var positionBuffer = gl.createBuffer();
  // prettier-ignore
  const rect = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
  gl.uniformMatrix3fv(u_matrixLoc, false, [2, 0, 0, 0, -2, 0, -1, 1, 1]);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

main();
