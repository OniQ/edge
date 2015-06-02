/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController1', ['$scope', 'fileUploadService', '$modal', 'localStorageService', '$rootScope',
        '$timeout', '$interval',
        function ($scope, fileUploadService, $modal, localStorageService, $rootScope, $timeout, $interval) {
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/kuroir");
            //editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.commands.addCommand({
                name: 'myCommand',
                bindKey: {win: 'Ctrl-M',  mac: 'Command-M'},
                exec: function(editor) {
                    //...
                },
                readOnly: true // false if this command should not apply in readOnly mode
            });
            editor.setOptions({
                mode: "ace/mode/javascript",
                autoScrollEditorIntoView: true
            });
            $scope.runSrc = function(){
                var session = editor.getSession();
                return session;
            }
        }]);
});
