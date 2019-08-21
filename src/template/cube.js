const vertexShaderSource = require("./glsl/cube.vert.glsl")
const fragmentShaderSource = require("./glsl/cube.frag.glsl")

// WebGL initial Functions will be maintained as default
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

function createObj(gl) {
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

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

var projectionMatrix, modelViewMatrix;
var rotationAxis;

function initMatrices(canvas)
{
    // Create a model view matrix with object at 0, 0, -8
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -8]);

    // Create a project matrix with 45 degree field of view
    // projectionMatrix = mat4.create();
    // mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
    
    projectionMatrix = new Float32Array([
        2.41421, 0, 0, 0,
        0, 2.41421, 0, 0,
        0, 0, -1.002002, -1,
        0, 0, -0.2002002, 0
    ]);
    rotationAxis = vec3.create();
    vec3.normalize(rotationAxis, [1, 1, 1]);
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
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function initShader(gl) {

    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

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
}

function draw(gl, obj) {
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Depth test 用这两行命令来告诉WebGL进行3D画图
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    // connect up the shader parameters: vertex position, color and projection/model matrices
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
    gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    // draw the object
    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
}

function onLoad() {
    var canvas = document.getElementById("webglcanvas");
    var gl = initWebGL(canvas);
    var cube = createObj(gl);
    initViewport(gl, canvas);
    initMatrices(canvas);
    initShader(gl);
    draw(gl, cube);
}

window.onload = onLoad;