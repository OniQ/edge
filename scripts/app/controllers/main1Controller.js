/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController1', ['$scope', 'fileUploadService', '$modal', 'localStorageService', '$rootScope',
        '$timeout', '$interval',
        function ($scope, fileUploadService, $modal, localStorageService, $rootScope, $timeout, $interval) {
            var canvas = angular.element('#displayWindow')[0];

            var rocket = {
                name: "rocket",
                appearance: {
                    name: "rocket.png",
                    status: "notLoaded",
                    type: "sprite"
                },
                sound:{
                    name: "Comet.mp3",
                    status: "notLoaded",
                    type: "audio"
                },
                speed: 3,
                width: 80,
                height: 80,
                z: 5,
                x: 500,
                y: 400,
                animation: 0
            };

            var space = {
                name: "background",
                appearance: {
                    name: "space.png",
                    status: "notLoaded",
                    type: "sprite"
                },
                z: 0,
                x: -55,
                y: -80,
                width: 700,
                height: 636,
                animation: 0
            };

            edge.turnOn(canvas, [space, rocket]);

            var edgeStorage = localStorageService.get('consoleCode');
            if (!edgeStorage)
                localStorageService.set('consoleCode', "var fn = edge.functionParameters;\n" +
                    "if (edge.firstRun){\n" +
                    "    var objects = edge.getByField('name', 'rocket');\n" +
                    "    fn.rocket = objects[0]; \n" +
                    "    fn.rocket.speed = 2; \n" +
                    "    fn.counter = 0;\n" +
                    "    fn.state = 0;\n" +
                    "    fn.rocket.x = 500;\n" +
                    "    fn.rocket.y = 400;\n" +
                    "    fn.rocket.animation = 0;\n" +
                    "    edge.playAudio(fn.rocket, 'sound');\n" +
                    "}\n" +
                    "fn.counter++;\n" +
                    "switch(fn.state){\n" +
                    "    case 0:\n" +
                    "         fn.rocket.y -= fn.rocket.speed;\n" +
                    "         break;\n" +
                    "    case 1: fn.rocket.x -= fn.rocket.speed;\n" +
                    "         break;\n" +
                    "    case 2: fn.rocket.y += fn.rocket.speed;\n" +
                    "         break;\n" +
                    "    case 3: fn.rocket.x += fn.rocket.speed;\n" +
                    "         break;\n" +
                    "}\n" +
                    "if (fn.counter > 120){\n" +
                    "   if (fn.state === 3 && !fn.boost){\n" +
                    "       fn.boost = true;\n" +
                    "       edge.playAudio(fn.rocket, 'sound')\n" +
                    "   }\n" +
                    "   else if (fn.state === 3 && fn.boost)\n" +
                    "       fn.boost = false;\n" +
                    "   fn.state = (fn.state+1) % (4);\n" +
                    "   fn.counter = 0;\n" +
                    "   fn.rocket.animation = fn.state;\n" +
                    "   if (fn.boost){\n" +
                    "       fn.rocket.animation = fn.rocket.animation + 4;\n" +
                    "       fn.rocket.speed = 3;\n" +
                    "   }\n" +
                    "   else\n" +
                    "     fn.rocket.speed = 2;\n" +
                    "}");
            $scope.unbind = localStorageService.bind($scope, 'consoleCode');

            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/kuroir");
            editor.$blockScrolling = Infinity;
            //editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.commands.addCommand({
                name: 'execute',
                bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
                exec: function(editor) {
                    $scope.runSrc();
                },
                readOnly: true // false if this command should not apply in readOnly mode
            });
            editor.commands.addCommand({
                name: 'save',
                bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                exec: function(editor) {
                    $scope.saveSrc();
                },
                readOnly: true
            });
            editor.setValue($scope.consoleCode, -1);
            $scope.runSrc = function(){
                var code = editor.getValue();
                edge.executeFunction(code);
            };
            $scope.saveSrc = function() {
                var code = editor.getValue();
                $scope.consoleCode = code;
            };
            $scope.stopFunction = edge.stopFunction;

            $interval(function(){
                $rootScope.engineInfo = edge.engineInfo;
            }, 100);
        }]);
});
