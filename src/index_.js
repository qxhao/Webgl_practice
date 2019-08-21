
const lightdirection = new Float32Array([-0.37904902, 0.53066863, 0.75809804]);

const positions = new Float32Array([ // Vertex coordinates
	-1.0, -1.0, -1.0,
	-1.0, 1.0, -1.0,
	1.0, -1.0, -1.0,
	-1.0, 1.0, -1.0,
	1.0, 1.0, -1.0,
	1.0, -1.0, -1.0,

	-1.0, -1.0, 1.0,
	1.0, -1.0, 1.0,
	-1.0, 1.0, 1.0,
	-1.0, 1.0, 1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, 1.0,

	-1.0, 1.0, -1.0,
	-1.0, 1.0, 1.0,
	1.0, 1.0, -1.0,
	-1.0, 1.0, 1.0,
	1.0, 1.0, 1.0,
	1.0, 1.0, -1.0,

	-1.0, -1.0, -1.0,
	1.0, -1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, -1.0, 1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0, 1.0,

	-1.0, -1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, 1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, 1.0, 1.0,
	-1.0, 1.0, -1.0,

	1.0, -1.0, -1.0,
	1.0, 1.0, -1.0,
	1.0, -1.0, 1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, -1.0,
	1.0, 1.0, 1.0
]);

const normals = new Float32Array([
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,

	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,

	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,

	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,

	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,

	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0
]);

const texCoords = new Float32Array([ // Texture coordinates
	0, 0,
	0, 1,
	1, 0,
	0, 1,
	1, 1,
	1, 0,

	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1,

	0, 0,
	0, 1,
	1, 0,
	0, 1,
	1, 1,
	1, 0,

	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1,

	0, 0,
	0, 1,
	1, 0,
	0, 1,
	1, 1,
	1, 0,

	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1
]);

const setting = {
	fov: 30,
	eye: [0, 0, 7],
	target: [0, 0, 0],
	up: [0, 1, 0],
}

function onLoad() {
	var canvas = document.getElementById("webglcanvas");
	var gl = initWebGL(canvas);

	// // Resize the canvas with the shape of the window
	// setCss(canvas);
	// window.onresize = function() {
	//  setCss(canvas);
	// }

	// 相机操作
	var currentAngle = [0.0, 0.0, 7.0];
	initEventHandlers(canvas, currentAngle);

	// 创建positionBuffer并缓存顶点数据

	// 创建texcoordBuffer并缓存贴图顶点数据

	// 创建normalBuffer并缓存法向数据

	// 创建texture并缓存一张贴图

	// 创建targetTexture并提供后续frameBuffer使用

	// 创建4个shaderProgram

	function draw() {
		
		var program = initShader(gl, null, null);
		// u_MvpMatrix buffering, 所有shaderProgram均需要
		var u_mvpmatrixLocation = gl.getUniformLocation(program, "u_MvpMatrix");
		var viewProjectionMatrix = new Matrix4();
		viewProjectionMatrix.setPerspective(setting.fov, canvas.width / canvas.height, 1.0, 100.0);
		viewProjectionMatrix.lookAt(
			setting.eye[0], setting.eye[1], setting.eye[2],
			setting.target[0], setting.target[1], setting.target[2],
			setting.up[0], setting.up[1], setting.up[2]
		);
		var mvpMatrix = new Matrix4();
		mvpMatrix.set(viewProjectionMatrix);
		mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
		mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
		gl.uniformMatrix4fv(u_mvpmatrixLocation, false, mvpMatrix.elements);
		
	}

	var tick = function() {
		draw();
		requestAnimationFrame(tick);
	}
	tick();
}


window.onload = onLoad;