/**
 * Created by OniQ on 23/04/15.
 */
var edge = new edgeCore();

function edgeCore() {
    var gl = null;
    var canvas = null;

    function initWebGL(canvas) {
        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch (e) {
        }

        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            gl = null;
        }
    }

    var vertexShaderSource =
        "    attribute vec3 vertexPos;\n" +
        "    uniform mat4 modelViewMatrix;\n" +
        "    uniform mat4 projectionMatrix;\n" +
        "    void main(void) {\n" +
        "        // Return the transformed and projected vertex value\n" +
        "        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);\n" +
        "    }\n";
    var fragmentShaderSource =
        "    void main(void) {\n" +
        "    // Return the pixel color: always output white\n" +
        "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
        "}\n";

// The transform matrix for the square - translate back in Z
    // for the camera
    var modelViewMatrix = new Float32Array(
        [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -3.333, 1
        ]);
    // The projection matrix (for a 45 degree field of view)
    var projectionMatrix = new Float32Array(
        [
            2.41421, 0, 0, 0,
            0, 2.41421, 0, 0,
            0, 0, -1.002002, -1,
            0, 0, -0.2002002, 0
        ]);

    if ( !window.requestAnimationFrame ) {

        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                    window.setTimeout( callback, 1000 / 60 );

                };

        } )();

    }

    function createSquare() {
        var vertexBuffer;
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var verts = [ .5, .5, 0.0,
                     -.5, .5, 0.0,
                      .5, -.5, 0.0,
                     -.5, -.5, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts),
            gl.STATIC_DRAW);
        var square = {
            buffer:vertexBuffer,
            vertSize:3,
            nVerts:4,
            primtype:gl.TRIANGLE_STRIP
        };
        return square;
    }

    function createShader(str, type) {
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

    function initShader() {

        // load and compile the fragment and vertex shader
        //var fragmentShader = getShader(gl, "fragmentShader");
        //var vertexShader = getShader(gl, "vertexShader");
        var fragmentShader = createShader(fragmentShaderSource, "fragment");
        var vertexShader = createShader(vertexShaderSource, "vertex");

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

    var bkgColor = {
        r : 0.0,
        g : 0.0,
        b : 0.0,
        alpha : 1.0
    };

    function draw(gl, obj) {
        // clear the background (with black)
        gl.clearColor(bkgColor.r, bkgColor.g, bkgColor.b, bkgColor.alpha);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // set the vertex buffer to be drawn
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        // set the shader to use
        gl.useProgram(shaderProgram);
        // connect up the shader parameters: vertex position and     projection/model matrices
        gl.vertexAttribPointer(shaderVertexPositionAttribute,
            obj.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false,
            projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false,
            modelViewMatrix);
        // draw the object
        gl.drawArrays(obj.primtype, 0, obj.nVerts);
    }

    var square;

    function run(){
        var buf = square.buffer;
        draw(gl, square);
        window.requestAnimationFrame(run);
    }

    function onKeyDown(ev){
        checkKey(ev);
        if (edgeEditor)
            edgeEditor.processKeyDown(ev);
    }

    function checkKey(ev){
        switch(ev.keyCode){
            case KEYCODES['1']:{
                bkgColor = {
                    r : 0.3,
                    g : 0.7,
                    b : 0.2,
                    alpha : 1.0
                };
                break;
            }
            case KEYCODES['2']:
            {
                bkgColor = {
                    r : 0.3,
                    g : 0.2,
                    b : 0.7,
                    alpha : 1.0
                };
                break;
            }
        }
    }

    window.onkeydown = onKeyDown;

    function clear(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        initViewport();
    }

    function initViewport(){
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    this.mouseState = {
        isPressed: false,
        x: null,
        y: null
    };

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        edge.mouseState.mouseDown = false;
    }

    function handleMouseMove(event) {
        var newX = event.clientX;
        var newY = event.clientY;
        var rect = canvas.getBoundingClientRect();
        edge.mouseState.x = newX - rect.left
        edge.mouseState.y = newY - rect.top;
    }

    this.turnOn = function(_canvas){
        canvas = _canvas;

        initWebGL(canvas);
        if (!gl)
            return;
        initViewport();
        square = createSquare(gl);
        initShader(gl);
        draw(gl, square);
        document.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;
        run();
        /*gl.clearColor(0.2, 0.2, 0.35, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        */
    }
}
/************** Constants **************/
var KEYCODES = {
    'backspace' : 8,
    'tab' : 9,
    'enter' : 13,
    'shift' : 16,
    'ctrl' : 17,
    'alt' : 18,
    'pause_break' : 19,
    'caps_lock' : 20,
    'escape' : 27,
    'page_up' : 33,
    'page down' : 34,
    'end' : 35,
    'home' : 36,
    'left_arrow' : 37,
    'up_arrow' : 38,
    'right_arrow' : 39,
    'down_arrow' : 40,
    'insert' : 45,
    'delete' : 46,
    '0' : 48,
    '1' : 49,
    '2' : 50,
    '3' : 51,
    '4' : 52,
    '5' : 53,
    '6' : 54,
    '7' : 55,
    '8' : 56,
    '9' : 57,
    'a' : 65,
    'b' : 66,
    'c' : 67,
    'd' : 68,
    'e' : 69,
    'f' : 70,
    'g' : 71,
    'h' : 72,
    'i' : 73,
    'j' : 74,
    'k' : 75,
    'l' : 76,
    'm' : 77,
    'n' : 78,
    'o' : 79,
    'p' : 80,
    'q' : 81,
    'r' : 82,
    's' : 83,
    't' : 84,
    'u' : 85,
    'v' : 86,
    'w' : 87,
    'x' : 88,
    'y' : 89,
    'z' : 90,
    'left_window key' : 91,
    'right_window key' : 92,
    'select_key' : 93,
    'numpad 0' : 96,
    'numpad 1' : 97,
    'numpad 2' : 98,
    'numpad 3' : 99,
    'numpad 4' : 100,
    'numpad 5' : 101,
    'numpad 6' : 102,
    'numpad 7' : 103,
    'numpad 8' : 104,
    'numpad 9' : 105,
    'multiply' : 106,
    'add' : 107,
    'subtract' : 109,
    'decimal point' : 110,
    'divide' : 111,
    'f1' : 112,
    'f2' : 113,
    'f3' : 114,
    'f4' : 115,
    'f5' : 116,
    'f6' : 117,
    'f7' : 118,
    'f8' : 119,
    'f9' : 120,
    'f10' : 121,
    'f11' : 122,
    'f12' : 123,
    'num_lock' : 144,
    'scroll_lock' : 145,
    'semi_colon' : 186,
    'equal_sign' : 187,
    'comma' : 188,
    'dash' : 189,
    'period' : 190,
    'forward_slash' : 191,
    'grave_accent' : 192,
    'open_bracket' : 219,
    'backslash' : 220,
    'closebracket' : 221,
    'single_quote' : 222
};