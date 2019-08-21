attribute vec4 a_Position;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
varying vec4 v_Normal;
void main(){
	v_Normal = a_Normal;
   	gl_Position = u_MvpMatrix * a_Position;
}