#ifdef GL_ES
precision mediump float;
#endif

const float NEAR = 0.1;
const float FAR = 100.0;

float scaledDepth(float depth) {
	float scaled = depth * 2.0 - 1.0;
	scaled = (2.0 * NEAR * FAR) / (FAR + NEAR - scaled * (FAR - NEAR));
	return scaled;
}

void main(){
	float depth = scaledDepth(gl_FragCoord.z);
	gl_FragColor = vec4(vec3(depth), 1.0);
}