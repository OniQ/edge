/**
 * Created by OniQ on 23/04/15.
 */
var edge = new edgeCore();

function edgeCore() {

    var gl = null;
    var canvas = null;
    var program;
    this.selectedObject = null;

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

    // Returns a random integer from 0 to range - 1.
    function randomInt(range) {
        return Math.floor(Math.random() * range);
    }

    function setRectangle(x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), gl.STATIC_DRAW);
    }

    var bkgColor = {
        r : 0.0,
        g : 0.0,
        b : 0.0,
        alpha : 1.0
    };

    function clear(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        initViewport();
    }

    function initViewport(){
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function initShaders(){
        // setup GLSL program
        var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
        var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
        program = createProgram(gl, [vertexShader, fragmentShader]);
        gl.useProgram(program);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable ( gl.BLEND ) ;
    }

    function render(obj) {
        var image = obj.appearance.image;
        var x1 = obj.x;
        var y1 = obj.y;
        var x2 = obj.width;
        var y2 = obj.height;
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        // provide texture coordinates for the rectangle.
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        var tx1, tx2, ty1, ty2;
        tx1 = obj.animation * obj.width;
        ty1 = 0;
        while(tx1 >= image.width){
            tx1 -= image.width;
            ty1 += obj.height;
        }
        tx2 = tx1 + obj.width;
        ty2 = ty1 + obj.height;
        tx1 = tx1/parseFloat(image.width);
        ty1 = ty1/parseFloat(image.height);
        tx2 = tx2/parseFloat(image.width);
        ty2 = ty2/parseFloat(image.height);
        var full = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0];
        var textureMap = [
            tx1,  ty1,
            tx2,  ty1,
            tx1,  ty2,
            tx1,  ty2,
            tx2,  ty1,
            tx2,  ty2];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureMap), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // set the resolution
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        // Create a buffer for the position of the rectangle corners.
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set a rectangle the same size as the image.
        setRectangle(x1, y1, x2, y2);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function pressed(key){
        return edge.pressedKeys.indexOf(key) != -1;
    }

    function isDirected(obj, direction, isOnlyDirection){
        if (isOnlyDirection == true)
            return (obj.movementDirection | direction) == direction;
        return obj.movementDirection & direction;
    }

    function control(obj){
        if (!obj || !obj.controllable)
            return;
        //if (obj.collide)
        //    return;
        if (pressed(KEYCODES['right_arrow'])) {
            obj.x += obj.speed || 1;
            if (!isDirected(obj, RIGHT))
                obj.movementDirection += RIGHT;
        }
        else if (isDirected(obj, RIGHT))
            obj.movementDirection -= RIGHT;

        if (pressed(KEYCODES['left_arrow'])) {
            obj.x -= obj.speed || 1;
            if (!isDirected(obj, LEFT))
                obj.movementDirection += LEFT;
        }
        else if (isDirected(obj, LEFT))
            obj.movementDirection -= LEFT;

        if (pressed(KEYCODES['down_arrow'])) {
            obj.y += obj.speed || 1;
            if (!isDirected(obj, DOWN))
                obj.movementDirection += DOWN;
        }
        else if (isDirected(obj, DOWN))
            obj.movementDirection -= DOWN;

        if (pressed(KEYCODES['up_arrow'])) {
            obj.y -= obj.speed || 1;
            if (!isDirected(obj, UP))
                obj.movementDirection += UP;
        }
        else if (isDirected(obj, UP))
            obj.movementDirection -= UP;
    }

    function physics(obj){
        if (obj.physics) {
            //fall
            obj.y += obj.speed || 1;
            if (!isDirected(obj, DOWN))
                obj.movementDirection += DOWN;
        }
        //collision
        if (obj.solid) {
            for (var i = 0; i < edge.gameObjects.length; i++) {
                var targetObj = edge.gameObjects[i];
                if (targetObj != obj) {
                    detectCollision(obj, edge.gameObjects[i], function (r1, r2) {
                        if (r2.solid) {
                            if (isDirected(r1, RIGHT))
                                r1.x -= r1.speed || 1;
                            if (isDirected(r1, UP))
                                r1.y += r1.speed || 1;
                            if (isDirected(r1, LEFT))
                                r1.x += r1.speed || 1;
                            if (isDirected(r1, DOWN))
                                r1.y -= r1.speed || 1;
                        }
                    }, function () {
                        //console.log('enterCollision');
                    }, function () {
                        //console.log('leaveCollision');
                    });
                }
            }
        }
    }

    function setSelectedObject(x, y){
        for(var i = 0; i < edge.gameObjects.length; i++) {
            var obj = edge.gameObjects[i];
            if (x >= obj.x && x <= obj.x + obj.width
                && y >= obj.y && y <= obj.y + obj.height) {
                edge.selectedObject = obj;
                obj.controllable = true;
                var event = new CustomEvent("edgeObjectSelected", { "detail": obj });
                document.dispatchEvent(event);
                //return;
            }
            else {
                obj.controllable = false;
            }
        }
    }

    function detectCollision(obj1, obj2, onCollision, onCollisionEnter, onCollisionExit) {
        if (obj1.x <= obj2.x + obj2.width &&
            obj1.x + obj1.width >= obj2.x &&
            obj1.y <= obj2.y + obj2.height &&
            obj1.height + obj1.y >= obj2.y) {
                onCollision(obj1, obj2);
            if (obj1.collide == false){
                onCollisionEnter();
            }
            obj1.collide = obj2;
        }
        else{
            if (obj1.collide)
                onCollisionExit();
            obj1.collide = false;
        }
    }

    function forEachObjectAction(action){
        if (edge.gameObjects.length == 0) {
            clear();
            return;
        }
        for(var i = 0; i < edge.gameObjects.length; i++) {
                var obj = edge.gameObjects[i];
                action(obj);
        }
    }

    function run(){
        forEachObjectAction(
            function(obj){
                if(obj.appearance && obj.appearance.image) {
                    render(obj);
                    control(obj);
                    physics(obj);
                }
            });
        window.requestAnimationFrame(run);
    }

    this.turnOn = function(_canvas){
        canvas = _canvas;
        initWebGL(canvas);
        if (!gl)
            return;
        initShaders();
        run();
        //Register events
        document.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;
    };

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
    /******* Accessible Data ******/
    this.gameObjects = [];
    this.pressedKeys = [];

    function compareByZ(a,b) {
        if (!a.z)
            return 1;
        if (a.z < b.z)
            return -1;
        if (a.z > b.z)
            return 1;
        return 0;
    }

    this.attachObject = function(obj){
        obj.movementDirection = 0;
        obj.animation = 0;
        edge.gameObjects.push(obj);
        edge.gameObjects.sort(compareByZ);
    };

    function removeObject(obj){
        var index = edge.gameObjects.indexOf(obj);
        if (index != -1)
            edge.gameObjects.splice(index, 1);
    }

    this.mouseState = {
        mouseDown: false,
        x: null,
        y: null
    };
    /******* Util functions ******/
    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }
    /******* Events ******/

    function onKeyUp(ev){
        edge.pressedKeys.splice(edge.pressedKeys.indexOf(ev.keyCode), 1);
    }

    function onKeyPress(ev){
        edge.pressedKeys.push(ev.keyCode);
    }

    function onKeyDown(ev){
        checkKey(ev);
        if (edgeEditor)
            edgeEditor.processKeyDown(ev);
    }

    function checkKey(ev){
        switch(ev.keyCode){
            case KEYCODES['right_arrow']:
            case KEYCODES['left_arrow']:
            case KEYCODES['up_arrow']:
            case KEYCODES['down_arrow']:
            case KEYCODES['backspace']:
                if (edge.selectedObject) {
                    ev.preventDefault();
                    //ev.stopPropagation();
                }
                if (!pressed(ev.keyCode))
                    edge.pressedKeys.push(ev.keyCode);
                break;
        }
        switch(ev.keyCode){
            case KEYCODES['1']:{
                clear();
                break;
            }
            case KEYCODES['2']:
            {
                bkgColor = {
                    r: 0.3,
                    g: 0.2,
                    b: 0.7,
                    alpha: 1.0
                };
                break;
            }
            case KEYCODES['4']:
                var mod = edge.selectedObject.appearance.image.width/edge.selectedObject.width*edge.selectedObject.appearance.image.height/edge.selectedObject.height;
                edge.selectedObject.animation = (edge.selectedObject.animation - 1) % mod;
                if (edge.selectedObject.animation < 0)
                    edge.selectedObject.animation += mod;
                break;
            case KEYCODES['5']:
                var mod = edge.selectedObject.appearance.image.width/edge.selectedObject.width*edge.selectedObject.appearance.image.height/edge.selectedObject.height;
                edge.selectedObject.animation = (edge.selectedObject.animation + 1) % mod;
                break;
            case KEYCODES['backspace']:
                removeObject(edge.selectedObject);
                break;
        }
    }

    var lastMouseX, lastMouseY;

    function handleMouseDown(event) {
        edge.mouseState.mouseDown = true;
        setSelectedObject(edge.mouseState.x, edge.mouseState.y);
    }

    function handleMouseUp(event) {
        edge.mouseState.mouseDown = false;
    }

    function handleMouseMove(event) {
        var newX = event.clientX;
        var newY = event.clientY;
        var rect = canvas.getBoundingClientRect();
        edge.mouseState.x = newX - rect.left - canvas.clientLeft;
        edge.mouseState.y = newY - rect.top - canvas.clientTop;
    }

    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
    window.onkeypress = onKeyPress;
}
/************** Constants **************/
var RIGHT = 1; // 0001
var LEFT = 2; // 0010
var UP = 4; // 0100
var DOWN = 8; // 1000

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