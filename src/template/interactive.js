const vertexShaderSource_render = require('./glsl/interactive_render.vert.glsl');
const fragmentShaderSource_render = require('./glsl/interactive_render.frag.glsl');
const vertexShaderSource_depth = require('./glsl/interactive_depth.vert.glsl');
const fragmentShaderSource_depth = require('./glsl/interactive_depth.frag.glsl');
const vertexShaderSource_normal = require('./glsl/interactive_normal.vert.glsl');
const fragmentShaderSource_normal = require('./glsl/interactive_normal.frag.glsl');
const vertexShaderSource_test = require('./glsl/interactive_test.vert.glsl');
const fragmentShaderSource_test = require('./glsl/interactive_test.frag.glsl');

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

function setCss(canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
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

function onLoad() {
    var canvas = document.getElementById("webglcanvas");
    var gl = initWebGL(canvas);
    // Resize the canvas with the shape of the window
    // setCss(canvas);
    // window.onresize = function() {
    //  setCss(canvas);
    // }
    initViewport(gl, canvas);
    initShaders(gl, vertexShaderSource_render, fragmentShaderSource_render);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // TODO: use createCube function to change Object
    // var cube = createCube(gl);
    // var n = cube.nIndices;

    var currentAngle = [0.0, 0.0, 7.0];

    initEventHandlers(canvas, currentAngle);

    var programs = [
        initShader(gl, vertexShaderSource_render, fragmentShaderSource_render),
        initShader(gl, vertexShaderSource_depth, fragmentShaderSource_depth),
        initShader(gl, vertexShaderSource_normal, fragmentShaderSource_normal),
        initShader(gl, vertexShaderSource_test, fragmentShaderSource_test)
    ];

    var texture = gl.createTexture();

    if (!initTextures(gl, texture)) {
        console.log("Unable to get Texture");
        return;
    }

    var fb = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    const targetTexture = gl.createTexture();
    targetTexture.width = 800;
    targetTexture.height = 800;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    var tick = function() {
        draw(gl, canvas, views, programs, currentAngle, fb, targetTexture);
        requestAnimationFrame(tick);
    }
    tick();

}


function draw(gl, canvas, views, programs, currentAngle, fb, targetTexture) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var ii=0; ii < views.length; ii++) {
        var viewSettings = views[ii];
        var left = Math.floor(canvas.width * viewSettings.left);
        var bottom = Math.floor(canvas.height * viewSettings.bottom);
        var width = Math.floor(canvas.width * viewSettings.height);
        var height = Math.floor(canvas.height * viewSettings.height);
        var program;

        var title = viewSettings.title;
        if (title == "Render") {
            program = programs[0];
            if (!initTextures(gl)) {
                console.log("Unable to get Texture");
                return;
            }
        }
        else if (title == "Depth") {
            program = programs[1];
        }
        else if (title == "Normal") {
            program = programs[2];
        }
        else {
            program = programs[3];
        }
        gl.useProgram(program);
        gl.program = program;

        var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
        if (!u_MvpMatrix) {
            console.log("Unable to link u_MvpMatrix");
            return;
        }

        var n = initVertexBuffers(gl);
        if (n < 0) {
            console.log("Unable to create Buffer");
            return;
        }

        if (title == "Render") {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
            if (!u_MvpMatrix) {
                console.log("Unable to link u_MvpMatrix");
                return;
            }

            var n = initVertexBuffers(gl);
            if (n < 0) {
                console.log("Unable to create Buffer");
                return;
            }
            var viewProjectionMatrix = new Matrix4();
            viewProjectionMatrix.setPerspective(viewSettings.fov, canvas.width / canvas.height, 1.0, 100.0);
            viewProjectionMatrix.lookAt(
                viewSettings.eye[0], viewSettings.eye[1], viewSettings.eye[2],
                viewSettings.target[0], viewSettings.target[1], viewSettings.target[2],
                viewSettings.up[0], viewSettings.up[1], viewSettings.up[2]
            );

            var mvpMatrix = new Matrix4();
            mvpMatrix.set(viewProjectionMatrix);

            mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
            mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            gl.viewport(left, bottom, width, height);
            gl.scissor(left, bottom, width, height);
            gl.clearColor(
                viewSettings.background[0], viewSettings.background[1],
                viewSettings.background[2], viewSettings.background[3]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);

            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);


            // start to render again to the target texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.viewport(0, 0, targetTexture.width, targetTexture.height);

            var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
            if (!u_MvpMatrix) {
                console.log("Unable to link u_MvpMatrix");
                return;
            }

            var n = initVertexBuffers(gl);
            if (n < 0) {
                console.log("Unable to create Buffer");
                return;
            }
            var viewProjectionMatrix = new Matrix4();
            viewProjectionMatrix.setPerspective(viewSettings.fov, canvas.width / canvas.height, 1.0, 100.0);
            viewProjectionMatrix.lookAt(
                viewSettings.eye[0], viewSettings.eye[1], viewSettings.eye[2],
                viewSettings.target[0], viewSettings.target[1], viewSettings.target[2],
                viewSettings.up[0], viewSettings.up[1], viewSettings.up[2]
            );

            var mvpMatrix = new Matrix4();
            mvpMatrix.set(viewProjectionMatrix);

            mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
            mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            gl.clearColor(
                viewSettings.background[0], viewSettings.background[1],
                viewSettings.background[2], viewSettings.background[3]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else if (title == "TEST") {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, targetTexture);
            gl.uniform1i(u_Sampler, 0);

            var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
            if (!u_MvpMatrix) {
                console.log("Unable to link u_MvpMatrix");
                return;
            }

            var n = initVertexBuffers(gl);
            if (n < 0) {
                console.log("Unable to create Buffer");
                return;
            }
            var viewProjectionMatrix = new Matrix4();
            viewProjectionMatrix.setPerspective(viewSettings.fov, canvas.width / canvas.height, 1.0, 100.0);
            viewProjectionMatrix.lookAt(
                viewSettings.eye[0], viewSettings.eye[1], viewSettings.eye[2],
                viewSettings.target[0], viewSettings.target[1], viewSettings.target[2],
                viewSettings.up[0], viewSettings.up[1], viewSettings.up[2]
            );

            var mvpMatrix = new Matrix4();
            mvpMatrix.set(viewProjectionMatrix);

            mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
            mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            gl.viewport(left, bottom, width, height);
            gl.scissor(left, bottom, width, height);
            gl.clearColor(
                viewSettings.background[0], viewSettings.background[1],
                viewSettings.background[2], viewSettings.background[3]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);

            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        }
        else {
            var viewProjectionMatrix = new Matrix4();
            viewProjectionMatrix.setPerspective(viewSettings.fov, canvas.width / canvas.height, 1.0, 100.0);
            viewProjectionMatrix.lookAt(
                viewSettings.eye[0], viewSettings.eye[1], viewSettings.eye[2],
                viewSettings.target[0], viewSettings.target[1], viewSettings.target[2],
                viewSettings.up[0], viewSettings.up[1], viewSettings.up[2]
            );

            var mvpMatrix = new Matrix4();
            mvpMatrix.set(viewProjectionMatrix);

            mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
            mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            gl.viewport(left, bottom, width, height);
            gl.scissor(left, bottom, width, height);
            gl.clearColor(
                viewSettings.background[0], viewSettings.background[1],
                viewSettings.background[2], viewSettings.background[3]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        }
    }
}

window.onload = onLoad;