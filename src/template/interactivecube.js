const vertexShaderSource = require('./glsl/interactivecube.vert.glsl');
const fragmentShaderSource = require('./glsl/interactivecube.frag.glsl');

var canvas, gl;
var points = [],
	colors = [];
var numVertices = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var currentAngle = [0, 0, 0];
var rotate = false;

var vRotateMatrix, rotateMatrix, u_rotateMatrix;
var vTranslateMatrix, translateMatrix, u_translateMatrix, Tx = 0;
Ty = 0;
var vScalingMatrix, scalingMatrix, u_scalingMatrix, factor = 0,
	Sx = 1,
	Sy = 1,
	Sz = 1;

window.onload = function cube() {
	canvas = document.getElementById('webglcanvas');
	gl = initWebGL(canvas);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	colorCube();
	var program = initShader(gl, vertexShaderSource, fragmentShaderSource);
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(clolrs), gl.STATIC_DRAW);
	var vColor = gl.getAttribLocation(program, 'vColor');
	gl.enableVertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAYBUFFER, flatten(points), gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation(program, 'vPosition');
	gl.enableVertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	vRotateMatrix = gl.getUniformLocation(program, 'vRotateMatrix');
	rotateMatrix = new Matrix4();
	rotateMatrix.setPerspecetive(45, canvas.width/canvas.height, 1.0, 10000);
	initMouseControl(canvas, currentAngle);

	vTranslateMatrix = gl.getUniformLocation(program, 'vTranslateMatrix');
	translateMatrix = new Matrix4();

	vScalingMatrix = gl.getUniformLocation(program, 'vScalingMatrix');
	scalingMatrix = new Matrix4;

	thetaLoc = gl.getUniformLocation(program, 'theta');

	document.getElementById('xRotate').onclick = function(){
		axis = xAxis;
	}
	document.getElementById('yRotate').onclick = function(){
		axis = yAxis;
	}
	document.getElementById('zRotate').onclick = function(){
		axis = zAxis;
	}
	document.getElementById('sRotate').onclick = function (){
	  rotate = !rotate;
	}

	render();

}

function render() {
	u_rotateMatrix = new Matrix4();
	u_rotateMatrix.set(rotateMatrix);


}



function initWebGL(canvas) {
	var gl;
	try {
		gl = canvas.getContext("experimental-webgl");
	} catch (e) {
		var msg = "Error creating WebGL Context!:" + e.toString();
		alert(msg);
		throw Error(msg);
	}
	return gl;
}

function createShader(gl, str, type) {
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShader(gl, vertexShaderSource, fragmentShaderSource) {
	// load and compile the fragment and vertex shader
	var vertexShader = createShader(gl, vertexShaderSource, "vertex");
	var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");

	// link them together into a new program
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// get pointers to the shader params
	// 建立完Attribute变量或者是使用pointer从cpu上传到gpu之后需要enable这个变量进行使用，即enableVertexAttribArray
	shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
	gl.enableVertexAttribArray(shaderVertexPositionAttribute);

	shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
	gl.enableVertexAttribArray(shaderVertexColorAttribute);

	shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
	shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	return shaderProgram;
}

function colorCube() {
	quad(1, 0, 3, 2);
	quad(2, 3, 7, 6);
	quad(3, 0, 4, 7);
	quad(6, 5, 1, 2);
	quad(4, 5, 6, 7);
	quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
	var vertices = [
		vec4(-0.25, -0.25, 0.25, 1.0),
		vec4(-0.25, 0.25, 0.25, 1.0),
		vec4(0.25, 0.25, 0.25, 1.0),
		vec4(0.25, -0.25, 0.25, 1.0),
		vec4(-0.25, -0.25, -0.25, 1.0),
		vec4(-0.25, 0.25, -0.25, 1.0),
		vec4(0.25, 0.25, -0.25, 1.0),
		vec4(0.25, -0.25, -0.25, 1.0)
	];

	var vertexColors = [
		[0.0, 0.0, 0.0, 1.0], // black
		[1.0, 0.0, 0.0, 1.0], // red
		[1.0, 1.0, 0.0, 1.0], // yellow
		[0.0, 1.0, 0.0, 1.0], // green
		[0.0, 0.0, 1.0, 1.0], // blue
		[1.0, 0.0, 1.0, 1.0], // magenta
		[0.0, 1.0, 1.0, 1.0], // cyan
		[1.0, 1.0, 1.0, 1.0] // white
	];


	var indices = [a, b, c, a, c, d];
	for (var i = 0; i < indices.length; ++i) {
		points.push(vertices[indices[i]]);
		colors.push(vertexColors[a]);
	}
}