function setCss(canvas) {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.style.width = canvas.width+"px";
	canvas.style.height = canvas.height+"px";
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

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }
    return program;
}

function loadTexture(gl,texture,image,level=0) {
    //对纹理图像进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,0);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D,texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D,level,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
}


function createCube(gl) {
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Geometry Buffer Data
    var verts = new Float32Array([
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Color Buffer Data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [
        [1.0, 0.0, 0.0, 1.0],       // Front face
        [0.0, 1.0, 0.0, 1.0],       // Back face
        [0.0, 0.0, 1.0, 1.0],       // Top face
        [1.0, 1.0, 0.0, 1.0],       // Bottom face
        [1.0, 0.0, 1.0, 1.0],       // Right face
        [0.0, 1.0, 1.0, 1.0]        // Left face
    ];
    var vertexColors = [];
    for (var i in faceColors) {
        var color = faceColors[i];
        for (var j = 0; j < 4; j++) {
            vertexColors = vertexColors.concat(color);
        }
    }
    var vertexColors = [];
    for (var i in faceColors) {
        var color = faceColors[i];
        for (var j = 0; j < 4; j++) {
            vertexColors = vertexColors.concat(color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn)
    var cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    var cubeIndices = [
        0, 1, 2,     0, 2, 3,       // Front face
        4, 5, 6,     4, 6, 7,       // Back face
        8, 9, 10,    8, 10, 11,     // Top face
        12, 13, 14,  12, 14, 15,    // Bottom face
        16, 17, 18,  16, 18, 19,    // Right face
        20, 21, 22,  20, 22, 23     // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    var cube = {
        buffer: vertexBuffer,
        colorBuffer: colorBuffer,
        indices: cubeIndexBuffer,
        vertSize: 3,
        nVerts: 24,
        colorSize: 4,
        nColors: 24,
        nIndices: 36,
        primtype: gl.TRIANGLES
    };

    return cube;
}

function initEventHandlers(canvas, currentAngle) {

    canvas.onmousedown = function (e) {
        var downX = e.clientX;
        var downY = e.clientY;

        var factorX = 0.3;
        var factorY = 0.2;

        var beforeAngle = [];
        beforeAngle[0] = currentAngle[0];
        beforeAngle[1] = currentAngle[1];
        beforeAngle[2] = currentAngle[2];

        document.onmousemove = function (e) {
            var moveX = e.clientX;
            var moveY = e.clientY;

            var x = factorX * (moveX - downX);
            var y = factorY * (moveY - downY);

            currentAngle[0] = Math.max(Math.min(beforeAngle[0] + y, 90.0), -90.0);
            currentAngle[1] = beforeAngle[1] + x;
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}
