const vertexShaderSource_render = require('./glsl/interactive_render.vert.glsl');
const fragmentShaderSource_render = require('./glsl/interactive_render.frag.glsl');
const vertexShaderSource_depth = require('./glsl/interactive_depth.vert.glsl');
const fragmentShaderSource_depth = require('./glsl/interactive_depth.frag.glsl');
const vertexShaderSource_normal = require('./glsl/interactive_normal.vert.glsl');
const fragmentShaderSource_normal = require('./glsl/interactive_normal.frag.glsl');
const vertexShaderSource_test = require('./glsl/interactive_test.vert.glsl');
const fragmentShaderSource_test = require('./glsl/interactive_test.frag.glsl');

const lightdirection = new Float32Array([-0.37904902, 0.53066863, 0.75809804]);

const views = [{
		left: 0,
		bottom: 0.5,
		width: 0.5,
		height: 0.5,
		background: [0.5, 0.5, 0.7, 1.0],
		eye: [0, 0, 7],
		target: [0, 0, 0],
		up: [0, 1, 0],
		fov: 30,
		title: "Render"
	},
	{
		left: 0.5,
		bottom: 0.5,
		width: 0.5,
		height: 0.5,
		background: [0.5, 0.7, 0.5, 1.0],
		eye: [0, 0, 7],
		target: [0, 0, 0],
		up: [0, 1, 0],
		fov: 30,
		title: "Depth"
	},
	{
		left: 0,
		bottom: 0,
		width: 0.5,
		height: 0.5,
		background: [0.7, 0.5, 0.5, 1.0],
		eye: [0, 0, 7],
		target: [0, 0, 0],
		up: [0, 1, 0],
		fov: 30,
		title: "Normal"
	},
	{
		left: 0.5,
		bottom: 0,
		width: 0.5,
		height: 0.5,
		background: [0.0, 0.0, 0.0, 1.0],
		eye: [0, 0, 7],
		target: [0, 0, 0],
		up: [0, 1, 0],
		fov: 30,
		title: "TEST"
	}
];

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


function onLoad() {
	var canvas = document.getElementById("webglcanvas");
	var gl = initWebGL(canvas);

	// // Resize the canvas with the shape of the window
	// setCss(canvas);
	// window.onresize = function() {
	//  setCss(canvas);
	// }

	var currentAngle = [0.0, 0.0, 7.0];

	initEventHandlers(canvas, currentAngle);

	// 创建positionBuffer并缓存顶点数据
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	// 创建texcoordBuffer并缓存贴图顶点数据
	var texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

	// 创建normalBuffer并缓存法向数据
	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

	// clear buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// 创建texture并缓存一张贴图
	var texture = gl.createTexture();
	texture.width = 512;
	texture.height = 512;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	var image = new Image();
	image.onload = function() {
		loadTexture(gl, texture, image);
	};
	image.src = "./src/lib/resources/diffuse.jpg"

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// 创建targetTexture并提供后续frameBuffer使用
	var targetTexture = gl.createTexture();
	targetTexture.width = 512;
	targetTexture.height = 512;
	gl.bindTexture(gl.TEXTURE_2D, targetTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
		targetTexture.width, targetTexture.height, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, null);
	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	const fb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

	// 创建4个shaderProgram并组合成一个数组，导入给后续draw使用
	var program_render = initShader(gl, vertexShaderSource_render, fragmentShaderSource_render);
	var program_depth = initShader(gl, vertexShaderSource_depth, fragmentShaderSource_depth);
	var program_normal = initShader(gl, vertexShaderSource_normal, fragmentShaderSource_normal);
	var program_test = initShader(gl, vertexShaderSource_test, fragmentShaderSource_test)

	var programs = [
		program_render, program_depth, program_normal, program_test
	];

	function draw() {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (var index = 0; index < programs.length; index++) {
			var setting = views[index];
			var left = Math.floor(canvas.width * setting.left);
			var bottom = Math.floor(canvas.height * setting.bottom);
			var width = Math.floor(canvas.width * setting.height);
			var height = Math.floor(canvas.height * setting.height);
			var program = programs[index];
			var title = setting.title;

			gl.useProgram(program);
			if (title == "Render") {
				{
					var u_lightLocation = gl.getUniformLocation(program, "u_Light");
					gl.uniform3fv(u_lightLocation, lightdirection);
				}
				var u_worldITLocation = gl.getUniformLocation(program, "u_worldIT")
				var a_positionLocation = gl.getAttribLocation(program, "a_Position");
				var a_normalLocation = gl.getAttribLocation(program, "a_Normal");
				var a_texcoordLocation = gl.getAttribLocation(program, "a_TextCoord");
				var u_samplerLocation = gl.getUniformLocation(program, "u_Sampler");
				var u_mvpmatrixLocation = gl.getUniformLocation(program, "u_MvpMatrix");
				var isWorldIT = 1;
				var isPosition = 1;
				var isTexCoord = 1;
				var isNormal = 1;
				var isSampler = 1;
				var isMvpMatrix = 1;
			} else if (title == "Depth") {
				var a_positionLocation = gl.getAttribLocation(program, "a_Position");
				var u_mvpmatrixLocation = gl.getUniformLocation(program, "u_MvpMatrix");
				var isWorldIT = 0;
				var isPosition = 1;
				var isTexCoord = 0;
				var isNormal = 0;
				var isSampler = 0;
				var isMvpMatrix = 1;
			} else if (title == "Normal") {
				var a_positionLocation = gl.getAttribLocation(program, "a_Position");
				var a_normalLocation = gl.getAttribLocation(program, "a_Normal");
				var u_mvpmatrixLocation = gl.getUniformLocation(program, "u_MvpMatrix");
				var isWorldIT = 0;
				var isPosition = 1;
				var isTexCoord = 0;
				var isNormal = 1;
				var isSampler = 0;
				var isMvpMatrix = 1;
			} else {
				var a_positionLocation = gl.getAttribLocation(program, "a_Position");
				var a_texcoordLocation = gl.getAttribLocation(program, "a_TextCoord");
				var u_samplerLocation = gl.getUniformLocation(program, "u_Sampler");
				var u_mvpmatrixLocation = gl.getUniformLocation(program, "u_MvpMatrix");
				var isWorldIT = 0;
				var isPosition = 1;
				var isTexCoord = 1;
				var isNormal = 0;
				var isSampler = 1;
				var isMvpMatrix = 1;
			}

			// a_Position buffering, 所有shaderProgram均需要
			if (isPosition){
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				var size = 3;
				var type = gl.FLOAT;
				var normalize = false;
				var stride = 0;
				var offset = 0;
			    gl.vertexAttribPointer(
			        a_positionLocation, size, type, normalize, stride, offset);
			    gl.enableVertexAttribArray(a_positionLocation);
   			}

			// a_TextCoord buffering
			if(isTexCoord) {
				gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
				var size = 2;
				var type = gl.FLOAT;
				var normalize = false;
				var stride = 0;
				var offset = 0;
				gl.vertexAttribPointer(
					a_texcoordLocation, size, type, normalize, stride, offset);
				gl.enableVertexAttribArray(a_texcoordLocation);
			}

			// a_Normal buffering
			if (isNormal) {
				gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
				var size = 3;
				var type = gl.FLOAT;
				var normalize = false;
				var stride = 0;
				var offset = 0;
				gl.vertexAttribPointer(
					a_normalLocation, size, type, normalize, stride, offset);
				gl.enableVertexAttribArray(a_normalLocation);
			}

			// u_MvpMatrix buffering, 所有shaderProgram均需要
			if (isMvpMatrix) {
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
				
				if (isWorldIT) {
					var mvMatrix = new Matrix4();
					mvMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
					mvMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
					gl.uniformMatrix4fv(u_worldITLocation, false, mvMatrix.elements);
				}
			}

			// u_Sampler buffering
			if (isSampler) {
				if (title == "Render") {
					gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.uniform1i(u_samplerLocation, 0);
					{
						gl.viewport(0, 0, targetTexture.width, targetTexture.height);
						gl.scissor(0, 0, targetTexture.width, targetTexture.height);
						gl.clearColor(
							setting.background[0], setting.background[1],
							setting.background[2], setting.background[3]);
						gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
						gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
					}
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.uniform1i(u_samplerLocation, 0);
					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				}
				else if (title == "TEST") {
					gl.bindTexture(gl.TEXTURE_2D, targetTexture);
					gl.uniform1i(u_samplerLocation, 0);
					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				}

			}
			
			gl.viewport(left, bottom, width, height);
			gl.scissor(left, bottom, width, height);
			gl.clearColor(
				setting.background[0], setting.background[1],
				setting.background[2], setting.background[3]);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.CULL_FACE);
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.SCISSOR_TEST);
			gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

			// gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
		}
	}

	var tick = function() {
		draw();
		requestAnimationFrame(tick);
	}
	tick();
}


window.onload = onLoad;