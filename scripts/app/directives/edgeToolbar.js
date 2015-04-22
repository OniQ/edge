/**
 * Created by OniQ on 22/04/15.
 */
define(['../modules/edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeToolbar', function(){
        return {
            templateUrl: "/edge/templates/panels/toolbar.html",
            controller: function($scope, $element, $attrs) {

            }
        };
    });
});