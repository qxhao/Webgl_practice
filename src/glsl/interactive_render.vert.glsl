attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_TextCoord;
uniform mat4 u_MvpMatrix;
uniform vec3 u_Light;
uniform mat4 u_worldIT;

varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying mat4 v_MvpMatrix;
varying vec3 v_Light;

void main(){
   gl_Position = u_MvpMatrix * a_Position;
   v_TexCoord = a_TextCoord;
   v_Normal = mat3(u_worldIT) * a_Normal;
   // v_Normal = a_Normal;
   v_MvpMatrix = u_MvpMatrix;
   v_Light = u_Light;
}