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
import fragmentShaderSource from 'asset-string:./s.frag';
import vertexShaderSource from 'asset-string:./s.vert';

import { h, Component, createRef } from 'preact';

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

function createTextureFromBitmap(gl: WebGLRenderingContext, bmp: ImageBitmap) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);

  return texture;
}

interface Props {
  width: number;
  height: number;
  lumaBmp: ImageBitmap;
  chromaBmp: ImageBitmap;
}

interface State {}

export default class ChromaCanvas extends Component<Props, State> {
  private _canvasRef = createRef<HTMLCanvasElement>();
  private _gl: WebGLRenderingContext | undefined;
  private _lumaTexture: WebGLTexture | undefined;
  private _chromaTexture: WebGLTexture | undefined;

  private _setup() {
    const gl = this._canvasRef.current!.getContext('webgl', {
      antialias: false,
      powerPreference: 'low-power',
    });

    if (!gl) throw Error(`Couldn't create GL context`);

    this._gl = gl;

    const frag = loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const vert = loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const program = createProgram(gl, [frag, vert]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    const positionLocation = gl.getAttribLocation(program, 'a_position');

    // look up uniform locations
    const lumaLoc = gl.getUniformLocation(program, 'u_luma');
    gl.uniform1i(lumaLoc, 0); // texture unit 0
    const chromaLoc = gl.getUniformLocation(program, 'u_chroma');
    gl.uniform1i(chromaLoc, 1); // texture unit 1
    const matrixLoc = gl.getUniformLocation(program, 'u_matrix');

    // provide texture coordinates for the rectangle.
    const positionBuffer = gl.createBuffer();
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
    gl.uniformMatrix3fv(matrixLoc, false, [2, 0, 0, 0, -2, 0, -1, 1, 1]);
  }

  private _updateLuma() {
    if (this._lumaTexture) {
      this._gl!.deleteTexture(this._lumaTexture);
    }
    this._gl!.activeTexture(this._gl!.TEXTURE0);
    this._lumaTexture = createTextureFromBitmap(this._gl!, this.props.lumaBmp)!;
    this._gl!.bindTexture(this._gl!.TEXTURE_2D, this._lumaTexture);
  }

  private _updateChroma() {
    if (this._chromaTexture) {
      this._gl!.deleteTexture(this._chromaTexture);
    }
    this._gl!.activeTexture(this._gl!.TEXTURE1);
    this._chromaTexture = createTextureFromBitmap(
      this._gl!,
      this.props.chromaBmp,
    )!;
    this._gl!.bindTexture(this._gl!.TEXTURE_2D, this._chromaTexture);
  }

  private _draw() {
    this._gl!.drawArrays(this._gl!.TRIANGLES, 0, 6);
  }

  componentDidMount() {
    this._setup();
    this._updateLuma();
    this._updateChroma();
    this._draw();
  }

  componentDidUpdate(previousProps: Props) {
    let redraw = false;

    if (
      previousProps.width !== this.props.width ||
      previousProps.height !== this.props.height
    ) {
      redraw = true;
      this._gl!.viewport(0, 0, this._gl!.canvas.width, this._gl!.canvas.height);
    }

    if (previousProps.chromaBmp !== this.props.chromaBmp) {
      redraw = true;
      this._updateChroma();
    }
    if (previousProps.lumaBmp !== this.props.lumaBmp) {
      redraw = true;
      this._updateLuma();
    }

    if (redraw) this._draw();
  }

  render({ width, height }: Props) {
    return (
      <canvas
        ref={this._canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width / devicePixelRatio}px`,
          height: `${height / devicePixelRatio}px`,
        }}
      />
    );
  }
}
