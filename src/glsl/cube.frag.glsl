precision mediump float;
varying vec4 vColor;
void main(void) {
	// vColor 在cube.vert.glsl中进行计算得到，并通过program传入cube.frag.glsl
    gl_FragColor = vColor;
}