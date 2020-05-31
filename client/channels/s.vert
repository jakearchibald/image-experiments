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
