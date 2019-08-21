#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_Normal;
void main(){
	gl_FragColor = vec4((v_Normal.xyz + 1.0) / 2.0,1.0);
}