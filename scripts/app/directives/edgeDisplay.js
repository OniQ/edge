/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeDisplay', function($timeout){
        return {
            controller: function($scope, $element, $attrs) {
                $timeout(function(){
                    var canvas = $element.context;
                    edge.turnOn(canvas);
                });
            }
        };
    });
});
