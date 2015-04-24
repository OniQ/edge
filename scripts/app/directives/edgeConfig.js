/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function(){
        return {
            templateUrl: "/edge/templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {
                $scope.configuration = {
                    title: "test title",
                    level: 20
                };
                $scope.fields = [];

                for (field in $scope.configuration){
                    $scope.fields.push({
                        name: field,
                        type: typeof($scope.configuration[field]),
                        value: $scope.configuration[field]
                    });
                }
            }
        };
    });
});
