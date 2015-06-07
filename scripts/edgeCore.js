/**
 * Created by OniQ on 23/04/15.
 */
var edge = new edgeCore();

function edgeCore() {

    var gl = null;
    var canvas = null;
    var program;
    var consoleFunction;
    this.engineInfo = {
        mouseDown: false,
        x: null,
        y: null
    };
    this.firstRun = false;
    this.selectedObject = null;
    this.resources = {};
    this.functions = {};
    this.cx = 0;
    this.cy = 0;
    this.camSpeed = 3;
    this.frameCounter = 0;
    this.editorEnabled = false;
    this.functionParameters = {};

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

    function clear(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        initViewport();
    }

    function initViewport(){
        gl.viewport(0+edge.cx, 0+edge.cy, canvas.width, canvas.height);
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
        var hasTexture = obj._texture;
        var image = getResource(obj.appearance.name, "image");
        if (!image || image === "loading")
            return;
        var x1 = obj.x;
        var y1 = obj.y;
        var x2 = obj.width;
        var y2 = obj.height;
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        // provide texture coordinates for the rectangle.
        if (!obj._texCoordBuffer)
            obj._texCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, obj._texCoordBuffer);
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


        if (!hasTexture) {
            // Create a texture.
            var texture = gl.createTexture();
            obj._texture = texture;
        }

        gl.bindTexture(gl.TEXTURE_2D, obj._texture);

        if (!hasTexture) {
            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }

        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // set the resolution
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        // Create a buffer for the position of the rectangle corners.
        if (!obj._positionBuffer) {
            var buffer = gl.createBuffer();
            obj._positionBuffer = buffer;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, obj._positionBuffer);
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
            obj.x += obj.speed;
            if (obj.fallSpeed && obj.jumping === false)
                obj.y -= obj.fallSpeed;
            if (!isDirected(obj, RIGHT))
                obj.movementDirection += RIGHT;
        }
        else if (isDirected(obj, RIGHT))
            obj.movementDirection -= RIGHT;

        if (pressed(KEYCODES['left_arrow'])) {
            obj.x -= obj.speed;
            if (obj.fallSpeed && obj.jumping === false)
                obj.y -= obj.fallSpeed;
            if (!isDirected(obj, LEFT))
                obj.movementDirection += LEFT;
        }
        else if (isDirected(obj, LEFT))
            obj.movementDirection -= LEFT;

        //if (pressed(KEYCODES['down_arrow'])) {
        //    obj.y += obj.speed;
        //    if (!isDirected(obj, DOWN))
        //        obj.movementDirection += DOWN;
        //}
        //else if (isDirected(obj, DOWN))
        //    obj.movementDirection -= DOWN;

        if (pressed(KEYCODES['up_arrow'])  && obj.jumping === false) {
            obj.jumping = 13;
        }

        if (obj.jumping){
            if (obj.fallSpeed)
                obj.y -= obj.fallSpeed;
            obj.y -= obj.fallSpeed + 3;
            obj.jumping--;
            if (!isDirected(obj, UP))
                obj.movementDirection += UP;
        }
        else if (isDirected(obj, UP))
            obj.movementDirection -= UP;
    }

    function physics(obj){
        if (obj.physics) {
            //fall
            obj.y += obj.fallSpeed;
        }
        else
            obj.fallSpeed = 0;
        //collision
        if (obj.solid) {
            for (var i = 0; i < edge.gameObjects.length; i++) {
                var targetObj = edge.gameObjects[i];
                if (targetObj != obj) {
                    detectCollision(obj, targetObj, function (r1, r2, o) {
                        if (r2.solid) {
                            //preventStuck(r1, o);
                            if (isDirected(r1, RIGHT))
                                r1.x -= r1.speed;
                            if (isDirected(r1, UP))
                                r1.y += r1.speed;
                            if (isDirected(r1, LEFT))
                                r1.x += r1.speed;
                            if (isDirected(r1, DOWN))
                                r1.y -= r1.speed;
                            if (r1.fallSpeed)
                                r1.y -= r1.fallSpeed;
                            obj.jumping = false;
                            var onCollision = getFunction(obj.onCollision);
                            if (isFunction(onCollision))
                                onCollision(r1, r2);
                        }
                    }, function (r1, r2) {
                        //console.log('enterCollision');
                        var onCollisionEnter = getFunction(obj.onCollisionEnter);
                        if (isFunction(onCollisionEnter))
                            onCollisionEnter(r1, r2);
                    }, function (r1, r2) {
                        //console.log('leaveCollision');
                        var onCollisionExit = getFunction(obj.onCollisionEnter);
                        if (isFunction(onCollisionExit))
                            onCollisionExit(r1, r2);
                    });
                }
            }
        }
    }

    function setSelectedObject(x, y){
        if (!x || !y)
            return;
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

    //function preventStuck(obj, o){
    //    if (obj.physics) {
    //        if (o[0].x1 - obj.speed < o[1].x1 &&
    //            o[0].x2 - obj.speed > o[1].x1 && ((o[0].y1 > o[1].y1 && o[0].y1 < o[1].y2)
    //            || (o[0].y2 > o[1].y1 && o[0].y1 < o[1].y2))) {
    //            obj.x--;
    //        }
    //        if (o[0].y2 - obj.speed < o[1].y2 &&
    //            o[0].y2 - obj.speed > o[1].y1 && ( (o[0].x1 > o[1].x1 && o[0].x1 < o[1].x2)
    //            || (o[0].x2 < o[1].x2 && o[0].x2 > o[1].x1))) {
    //            obj.y--;
    //        }
    //        if (o[0].x2 + obj.speed > o[1].x2 &&
    //            o[0].x1 + obj.speed < o[1].x2 && ((o[0].y2 > o[1].y2 && o[0].y2 < o[1].y1)
    //            || (o[0].y1 > o[1].y2 && o[0].y2 < o[1].y1))) {
    //            obj.x++;
    //        }
    //        if (o[0].y1 + obj.speed > o[1].y1 &&
    //            o[0].y1 + obj.speed < o[1].y2 && ( (o[0].x2 > o[1].x2 && o[0].x2 < o[1].x1)
    //            || (o[0].x1 < o[1].x1 && o[0].x1 > o[1].x2))) {
    //            obj.y++;
    //        }
    //    }
    //}

    function fillBounds(obj, o){
        if (obj.collisionBox){
            //var x, y;
            var collisionBox = obj.collisionBox;
            //x = obj.animation * obj.width;
            //y = 0;
            //while(x >= obj.appearance.image.width){
            //    x -= obj.appearance.image.width;
            //    y += obj.height;
            //}
            //
            //var x1 = obj.x + collisionBox.left - x;
            //var y1 = obj.y + collisionBox.top - y;

            o.push({
                x1: obj.x + collisionBox.left,
                y1: obj.y + collisionBox.top,
                x2: obj.x + collisionBox.left + collisionBox.width,
                y2: obj.y + collisionBox.top + collisionBox.height
            });
        }
        else{
            o.push({
                x1: obj.x,
                y1: obj.y,
                x2: obj.x + obj.width,
                y2: obj.y + obj.height
            });
        }
    }

    function detectCollision(obj1, obj2, onCollision, onCollisionEnter, onCollisionExit) {
        var o = [];
        fillBounds(obj1, o);
        fillBounds(obj2, o);
        if (o[0].x1 <= o[1].x2 &&
            o[0].x2 >= o[1].x1 &&
            o[0].y1 <= o[1].y2 &&
            o[0].y2 >= o[1].y1) {
            onCollision(obj1, obj2, o);
            if (obj1.collide == false) {
                onCollisionEnter(obj1, obj2);
            }
            obj1.collide = obj2;
        }
        else{
            if (obj1.collide)
                onCollisionExit(obj1, obj2);
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
        if (edge.firstRun == true){
            consoleFunction();
            edge.firstRun = false;
        }
        if (consoleFunction)
            consoleFunction();
        forEachObjectAction(
            function(obj){
                if(obj.appearance) {
                    //if (!obj.rendered)
                    render(obj);
                    control(obj);
                    physics(obj);
                }
                var behaviour = getFunction(obj.behaviour);
                if (isFunction(behaviour))
                    behaviour(obj);
            });
        initViewport();
        edge.frameCounter++;
        window.requestAnimationFrame(run);
    }

    this.playAudio = function(obj, name){
        if(!obj)
            return;
        var audioProp = obj[name];
        if (audioProp && audioProp.type === "audio") {
            var audio = getResource(audioProp.name, "audio");
            if (!audio || audio === "loading")
                return;
            audio.play();
        }
    };

    this.getByField = function(field, val){
        var objList = [];
        for (var i = 0; i < edge.gameObjects.length; i++){
            var obj = edge.gameObjects[i];
            if (obj[field] == val)
                objList.push(obj)
        }
        return objList;
    };

    this.executeFunction = function(code){
        var action = new Function (code);
        consoleFunction = action;
        edge.firstRun = true;
    };

    this.stopFunction = function(){
        consoleFunction = null;
    };

    this.removeObject = function(obj){
        var index = edge.gameObjects.indexOf(obj);
        if (index != -1)
            edge.gameObjects.splice(index, 1);
    };

    this.turnOn = function(_canvas, build){
        if (_canvas)
            canvas = _canvas;
        if (typeof(build) == "string") {
            download(build, function (e) {
                edge.gameObjects = JSON.parse(e.target.result);
            }, "text");
        }
        else if (typeof(build) == "object"){
            edge.gameObjects = build;
        }
        else
            edge.gameObjects = []
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

    function initObject(obj){
        obj.movementDirection = 0;
        obj.animation = 0;
        obj.currentSpeed = 0;
        if (!obj.z)
            obj.z = 0;
        if (!obj.speed)
            obj.speed = 1;
        if (!obj.fallSpeed)
            obj.fallSpeed = obj.speed;
    }

    this.addResource = function(name, resource){
        edge.resources[name] = resource;
    };

     function getResource(name, type){
        if (!edge.resources[name]) {
            if (edge.resources[name] != "loading") {
                download(name, function (e) {
                    var resource;
                    switch (type) {
                        case "image":
                            resource = new Image();
                            break;
                        case "audio":
                            resource = new Audio();
                            break;
                    }
                    resource.src = e.target.result;
                    //var sizeInfo = sizeof(resource.src);
                    //console.log(name + ":" + sizeInfo);
                    edge.resources[name] = resource;
                }, "data");
                edge.resources[name] = "loading";
            }
        }
        return edge.resources[name];
    };

    function getFunction(fn){
        if (!fn)
        return;
        if (!edge.functions[fn.name]) {
            download(fn.name + '.txt', function(e) {
                var theInstructions = e.target.result;
                var action = new Function ('obj1, obj2', theInstructions);
                edge.functions[fn.name] = action;
            }, "text");
            edge.functions[fn.name] = "loading";
        }
        return edge.functions[fn.name];
    }

    this.attachObject = function(obj){
        initObject(obj);
        edge.gameObjects.push(obj);
        edge.gameObjects.sort(compareByZ);
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
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    /******* DROPBOX *******/
    var DropBoxOAuthToken = "xsSYI8iCaMIAAAAAAAAJf40D4ejKgIMzI9fB5Eo6z1F6zxipAcx_fxIPYYDKCEJb";

    function download(path, onload, type){
        if (!path)
            return;
        var oReq = new XMLHttpRequest();
        var url = 'https://api-content.dropbox.com/1/files/auto/' + path;
        oReq.open("GET", url, true);
        oReq.setRequestHeader('Authorization', 'Bearer ' + DropBoxOAuthToken);
        oReq.responseType = "arraybuffer";
        oReq.onreadystatechange = function()
        {
            if (oReq.readyState == 4 && oReq.status == 200)
            {
                var header = oReq.getResponseHeader("x-dropbox-metadata");
                var metaData = JSON.parse(header);
                var arrayBufferView = new Uint8Array( oReq.response );
                var blob = new Blob([arrayBufferView], {type: metaData.mime_type});
                var fileReader = new FileReader();
                switch(type){
                    case "text":
                        fileReader.readAsText(blob);
                        break;
                    case "data":
                    default:
                        fileReader.readAsDataURL(blob);
                        break;
                }
                fileReader.onload = onload;
            }
        };
        oReq.send();
    };
    /******* Events ******/

    function onKeyUp(ev){
        edge.pressedKeys.splice(edge.pressedKeys.indexOf(ev.keyCode), 1);
    }

    function onKeyPress(ev){
        edge.pressedKeys.push(ev.keyCode);
    }

    function onKeyDown(ev){
        if (edge.editorEnabled) {
            checkKey(ev);
            if (edgeEditor)
                edgeEditor.processKeyDown(ev);
        }
    }

    function checkKey(ev){
        switch(ev.keyCode){
            case KEYCODES['right_arrow']:
            case KEYCODES['left_arrow']:
            case KEYCODES['up_arrow']:
            case KEYCODES['down_arrow']:
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
                break;
            }
            case KEYCODES['4']:
                var mod = 16;
                if (edge.selectedObject) {
                    edge.selectedObject.animation = (edge.selectedObject.animation - 1) % mod;
                    if (edge.selectedObject.animation < 0)
                        edge.selectedObject.animation += mod;
                }
                break;
            case KEYCODES['5']:
                if (edge.selectedObject) {
                    var mod = 16;
                    edge.selectedObject.animation = (edge.selectedObject.animation + 1) % mod;
                }
                break;
            case KEYCODES['r']:
                if (edge.selectedObject) {
                    edge.removeObject(edge.selectedObject);
                }
                break;
        }
    }

    function handleMouseDown(event) {
        edge.engineInfo.mouseDown = true;
        setSelectedObject(edge.engineInfo.x, edge.engineInfo.y);
    }

    function handleMouseUp(event) {
        edge.engineInfo.mouseDown = false;
    }

    function handleMouseMove(event) {
        var newX = event.clientX;
        var newY = event.clientY;
        var rect = canvas.getBoundingClientRect();
        edge.engineInfo.x = newX - rect.left - canvas.clientLeft;
        edge.engineInfo.y = newY - rect.top - canvas.clientTop;
        if (edge.engineInfo.x > canvas.width + canvas.clientLeft) {
            edge.engineInfo.x = null;
            edge.selectedObject = null;
        }
        if (edge.engineInfo.y > canvas.height + canvas.clientTop ) {
            edge.engineInfo.y = null;
            edge.selectedObject = null;
        }
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