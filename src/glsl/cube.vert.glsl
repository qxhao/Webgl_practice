attribute vec3 vertexPos;
attribute vec4 vertexColor;
// vertexPos, vertxColor are defined in createObj
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
// modelViewMatrix, projectionMatrix are defined in initMatrices
varying vec4 vColor;
void main(void) {
	// Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * 
        vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}