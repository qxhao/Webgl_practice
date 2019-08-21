#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;

varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying mat4 v_MvpMatrix;
varying vec3 v_Light;

void main(){
	vec3 normal = normalize(v_Normal);
	float light = dot(normal, v_Light);
	gl_FragColor = texture2D(u_Sampler,v_TexCoord);
	gl_FragColor.rgb *= light;
}