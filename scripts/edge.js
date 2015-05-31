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
                this.setPreviousStatement(true);
                this.appendDummyInput()
                    .appendField("Play Audio");
                this.appendValueInput("NAME")
                    .setCheck("String");
                this.setTooltip('Enter objects audio field name');
            }
        };

        Blockly.JavaScript['playaudio'] = function(block) {
            var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
            var code = "edge.playAudio(obj1, " + value_name + ")";
            return code;
        };

        Blockly.Blocks['changeAnimation'] = {
            init: function () {
                this.setColour(210);
                this.setPreviousStatement(true);
                this.appendDummyInput()
                    .appendField("Change Animation");
                this.appendValueInput("animation")
                    .setCheck("Number");
                this.setTooltip('Enter animation value');
            }
        };

        Blockly.JavaScript['changeAnimation'] = function(block) {
            var value_name = Blockly.JavaScript.valueToCode(block, 'animation', Blockly.JavaScript.ORDER_ATOMIC);
            var code = "obj1.animation = " + value_name;
            return code;
        };

        function getProperty(block){
            var value_propertyinput = Blockly.JavaScript.valueToCode(block, 'propertyInput', Blockly.JavaScript.ORDER_ATOMIC);
            var variable_propertyvalue = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('propertyValue'), Blockly.Variables.NAME_TYPE);
            var code = "null";
            switch(variable_propertyvalue){
                case "current_obj":
                    code = "obj1["+value_propertyinput+"]";
                    break;
                case "target_obj":
                    code = "obj2["+value_propertyinput+"]";
                    break;
            }
            return [code, Blockly.JavaScript.ORDER_NONE];
        }

        Blockly.Blocks['property1'] = {
            init: function() {
                this.setColour(120);
                this.appendValueInput("propertyInput")
                    .appendField(new Blockly.FieldVariable("current obj"), "propertyValue")
                    .setCheck("String");
                this.setInputsInline(true);
                this.setOutput(true);
                this.setTooltip('');
            }
        };

        Blockly.Blocks['property2'] = {
            init: function() {
                this.setColour(120);
                this.appendValueInput("propertyInput")
                    .appendField(new Blockly.FieldVariable("target obj"), "propertyValue")
                    .setCheck("String");
                this.setInputsInline(true);
                this.setOutput(true);
                this.setTooltip('');
            }
        };

        Blockly.JavaScript['property1'] = function(block) {
            return getProperty(block)
        };

        Blockly.JavaScript['property2'] = function(block) {
            return getProperty(block)
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
