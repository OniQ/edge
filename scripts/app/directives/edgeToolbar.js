/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeToolbar', function($rootScope){
        return {
            templateUrl: "/edge/templates/panels/toolbar.html",
            controller: function($scope, $element, $attrs) {
                $scope.makeDisplayResizable = function(){
                    $rootScope.isResizable = !$rootScope.isResizable;
                }
            }
        };
    });
});
