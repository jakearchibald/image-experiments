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
precision lowp float;

// our textures
uniform sampler2D u_luma;
uniform sampler2D u_chroma;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  vec4 lumaRGB = texture2D(u_luma, v_texCoord).rgba;
  vec4 chromaRGB = texture2D(u_chroma, v_texCoord).rgba;
  float y = 0.256788235 * lumaRGB.r + 0.504129412 * lumaRGB.g + 0.097905882 * lumaRGB.b + 0.062745098;
  float cb = -0.148223529 * chromaRGB.r + -0.290992157 * chromaRGB.g + 0.439215686 * chromaRGB.b + 0.501960784;
  float cr = 0.439215686 * chromaRGB.r + -0.367788235 * chromaRGB.g + -0.071427451 * chromaRGB.b + 0.501960784;

  float yMul = 1.164381 * y;

  gl_FragColor = vec4(
    yMul + 1.5960195 * cr + -0.8742024,
    yMul + -0.3917565 * cb + -0.8129655 * cr + 0.5316682,
    yMul + 2.0172285 * cb + -1.0856326,
    1
  );
}
