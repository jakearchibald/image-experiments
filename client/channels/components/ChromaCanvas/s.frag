precision lowp float;

// our textures
uniform sampler2D u_luma;
uniform sampler2D u_chroma;
uniform float showY;
uniform float showCb;
uniform float showCr;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  vec4 lumaRGB = texture2D(u_luma, v_texCoord).rgba;
  vec4 chromaRGB = texture2D(u_chroma, v_texCoord).rgba;
  float y = mix(0.5, 0.256788235 * lumaRGB.r + 0.504129412 * lumaRGB.g + 0.097905882 * lumaRGB.b + 0.062745098, showY);
  float cb = mix(0.5, -0.148223529 * chromaRGB.r + -0.290992157 * chromaRGB.g + 0.439215686 * chromaRGB.b + 0.501960784, showCb);
  float cr = mix(0.5, 0.439215686 * chromaRGB.r + -0.367788235 * chromaRGB.g + -0.071427451 * chromaRGB.b + 0.501960784, showCr);

  float yMul = 1.164381 * y;

  gl_FragColor = vec4(
    yMul + 1.5960195 * cr + -0.8742024,
    yMul + -0.3917565 * cb + -0.8129655 * cr + 0.5316682,
    yMul + 2.0172285 * cb + -1.0856326,
    1
  );
}
