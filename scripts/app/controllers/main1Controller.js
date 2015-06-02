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
                speed: 3,
                width: 80,
                height: 80,
                z: 5,
                x: 485,
                y: 155,
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
                y: -90,
                width: 700,
                height: 636,
                animation: 0
            };

            edge.turnOn(canvas, [space, rocket]);

            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/kuroir");
            //editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.commands.addCommand({
                name: 'execute',
                bindKey: {win: 'Ctrl-M',  mac: 'Command-M'},
                exec: function(editor) {
                    $scope.runSrc();
                },
                readOnly: true // false if this command should not apply in readOnly mode
            });
            editor.setOptions({
                mode: "ace/mode/javascript",
                autoScrollEditorIntoView: true
            });
            $scope.runSrc = function(){
                //var session = editor.getSession();
                var code = editor.getValue();
                edge.executeFunction(code);
            };
        }]);
});
