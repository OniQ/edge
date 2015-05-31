/**
 * Created by OniQ on 20/04/15.
 */
define([
    // Dependencies
    'ngRoute'
], function(
){
    var edge = angular.module('edge', ['ngRoute',
        'edge.controllers', 'edge.directives', 'edge.services',
        'ui.bootstrap', 'ngDragDrop', 'jackrabbitsgroup.angular-area-select',
    'ui.bootstrap', 'LocalStorageModule', 'ngFileUpload']);

    edge.config(function($routeProvider, localStorageServiceProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'templates/main.html',
                controller: 'mainController'
            })
            .otherwise({ redirectTo: "/" });

        localStorageServiceProvider
            .setPrefix('edge');

        Blockly.Blocks['playaudio'] = {
            init: function () {
                this.setColour(210);
                this.appendDummyInput()
                    .appendField("Play Audio");
                this.appendValueInput("NAME")
                    .setCheck("String");
                this.setTooltip('Enter objects audio field name');
            }
        }

        Blockly.JavaScript['playaudio'] = function(block) {
            var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
            var code = "edge.playAudio(obj1, " + value_name + ")";
            return code;
        };
    });

    edge.run(function($rootScope, $timeout){
        $rootScope.isResizable = false;
        $rootScope.canvasWidth = 640;
        $rootScope.canvasHeight = 480;
        $rootScope.autoSaveComponents = true;
    });

    return edge;
});
