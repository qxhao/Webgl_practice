const vertexShaderSource = require("./glsl/helloworld.vert.glsl")
const fragmentShaderSource = require("./glsl/helloworld.frag.glsl")

function initWebGL(canvas) {
    var gl;
    try {
        gl = canvas.getContext("webgl");
    } catch (e) {
        var msg = "Error creating WebGL Context!:" + e.toString();
        alert(msg);
        throw Error(msg);
    }
    return gl;
}

function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.viewport(x, y, width, height)
    // (x, y): 视野的左下角坐标
    // (width, height): 视野的宽度，高度
}

function createObj(gl) {
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    // gl.createBuffer()
    // return a WebGLBuffer storing data such as vertices or colors
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bindBuffer(target, buffer)
    // target: gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texutre coordinate data or vertex color data
    // buffer: a WebGLBuffer to bind
    // 这个函数相当于一个定义，定义了这个vertexBuffer中绑定了什么类型的数据

    var verts = new Float32Array([
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, -0.0
    ]);
    
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    // gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length)
    // target: gl.ARRAY_BUFFER
    // srcData: ArrayBufferView typed data, ArrayBufferView is a helper type representing any of the JavaScript TypedArray types
    // 相当于将JavaScript中的数据类型做一个解释放到webgl中进行使用，这样可以再JS中进行数据编辑，然后导入到gl中使用
    // usage: specifying the usage patter of the data
    // gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often
    var square = { buffer: vertexBuffer, vertSize: 3, nVerts: 4, primtype: gl.TRIANGLE_STRIP };
    // 定义一个Object square
    return square;
}

function initMatrices() {
    // The transform matrix for the square - translate back in Z for the camera
    modelViewMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -3.333, 1
    ]);

    // The projection matrix (for a 45 degree field of view)
    projectionMatrix = new Float32Array([
        2.41421, 0, 0, 0,
        0, 2.41421, 0, 0,
        0, 0, -1.002002, -1,
        0, 0, -0.2002002, 0
    ]);
}

function createShader(gl, str, type) {
    // Shader creater

    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    // gl.createShader(ShaderType): Either gl.FRAGMENT_SHADER or gl.VERTEX_SHADER

    gl.shaderSource(shader, str);
    // gl.shaderSource(Shader, Source)
    // Source is String typed shader descriptor, saved in .glsl files
    gl.compileShader(shader);
    // gl.compileShader(Shader)
    // TODO

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

var shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function initShader(gl) {
    // load and compile the fragment and vertex shader
    //var fragmentShader = getShader(gl, "fragmentShader");
    //var vertexShader = getShader(gl, "vertexShader");
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, obj) {
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // set the vertex buffer to be drawn
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    // set the shader to use
    gl.useProgram(shaderProgram);

    // connect up the shader parameters: vertex position and projection/model matrices
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    // draw the object
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

function onLoad() {
    var canvas = document.getElementById("webglcanvas");
    var gl = initWebGL(canvas);
    initViewport(gl, canvas);
    var square = createObj(gl);
    initMatrices();
    initShader(gl);
    draw(gl, square);
}

window.onload = onLoad;