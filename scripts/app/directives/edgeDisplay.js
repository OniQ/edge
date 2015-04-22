/**
 * Created by OniQ on 22/04/15.
 */


define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeDisplay', function(){
        return {
            controller: function($scope, $element, $attrs) {
                var canvas = $element.context;
                edge.turnOn(canvas);
            }
        };
    });
});