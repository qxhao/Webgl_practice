precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D uSampler;
void main(void) {
    // Return the pixel color: always output white
    gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
}