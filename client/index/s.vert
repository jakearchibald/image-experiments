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

attribute vec2 a_position;

uniform mat3 u_matrix;

varying vec2 v_texCoord;

void main() {
   gl_Position = vec4(u_matrix * vec3(a_position, 1), 1);

   // because we're using a unit quad we can just use
   // the same data for our texcoords.
   v_texCoord = a_position;
}
