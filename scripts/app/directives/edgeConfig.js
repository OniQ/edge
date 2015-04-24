/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function($timeout){
        return {
            templateUrl: "/edge/templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {
                $scope.configuration = {
                    title: "test title",
                    level: 20,
                    a: 'a',
                    b: 'b',
                    C: 'c',
                    d: 'd',
                    f: 'f',
                    e: 'e',
                    g: 'g',
                    x: 'xxx',
                    a1: 'a',
                    b2: 'b',
                    C3: 'c',
                    d4: 'd',
                    f1: 'f',
                    e2: 'e',
                    g3: 'g',
                    x4: 'xxx'
                };
                $scope.fields = [];
                for (field in $scope.configuration){
                    $scope.fields.push({
                        name: field,
                        type: typeof($scope.configuration[field]),
                        value: $scope.configuration[field]
                    });
                }
                var columnsCount = Math.ceil($scope.fields.length / 4.0);
                var minimum = Math.min(4, columnsCount);
                $scope.colClass = 'col-xs-' + 12 / minimum;
                $scope.columns = [];
                var size = $scope.fields.length/columnsCount;
                while ($scope.fields.length > 0)
                    $scope.columns.push($scope.fields.splice(0, size));
            }
        };
    });
});
