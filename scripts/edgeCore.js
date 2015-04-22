/**
 * Created by OniQ on 23/04/15.
 */
var edge = new edgeCore();

function edgeCore() {

    function initWebGL(canvas) {
        gl = null;

        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch (e) {
        }

        // If we don't have a GL context, give up now
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            gl = null;
        }

        return gl;
    }

    this.turnOn = function(canvas){

        var gl = initWebGL(canvas);

        if (!gl)
            return;
        gl.clearColor(0.2, 0.2, 0.35, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
}
