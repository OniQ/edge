/**
 * Created by OniQ on 23/04/15.
 */
var edge = new edgeCore();

function edgeCore() {
    var gl = null;

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

    function createSquare() {
        var vertexBuffer;
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var verts = [ .5, .5, 0.0, -.5, .5, 0.0, .5, -.5, 0.0, -.5, -.5, 0.0 ];
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

    function draw(gl, obj) {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

    this.turnOn = function(canvas){

        initWebGL(canvas);
        if (!gl)
            return;
        gl.viewport(0, 0, canvas.width, canvas.height);
        var square = createSquare(gl);
        initShader(gl);
        draw(gl, square);
        /*gl.clearColor(0.2, 0.2, 0.35, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        */
    }
}
