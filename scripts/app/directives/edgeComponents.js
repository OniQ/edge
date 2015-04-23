/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeComponents', function(){
        return {
            templateUrl: "/edge/templates/panels/componentsPanel.html",
            controller: function($scope, $element, $attrs) {
                $scope.oneAtATime = false;
                $scope.items1 = ['Item1', 'Item2', 'Item3'];
                $scope.items2 = ['boo'];

                $scope.groups = [
                    {
                        title: 'Dynamic Group Header - 1',
                        items: $scope.items1
                    },
                    {
                        title: 'Dynamic Group Header - 2',
                        items: $scope.items2
                    }
                ];
            }
        };
    });
});
