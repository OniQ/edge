/**
 * Created by OniQ on 22/04/15.
 */
define(['../modules/edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function(){
        return {
            templateUrl: "/edge/templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {

            }
        };
    });
});