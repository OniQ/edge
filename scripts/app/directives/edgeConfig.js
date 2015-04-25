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
                    x4: 'xxx',
                    is: true,
                    list: ['ok', 'go'],
                    title1: "test title",
                    level1: 20,
                    a7: 'a',
                    b7: 'b',
                    C7: 'c',
                    d7: 'd',
                    f7: 'f',
                    e7: 'e',
                    g7: 'g',
                    x7: 'xxx',
                    a71: 'a',
                    b72: 'b',
                    C73: 'c',
                    d74: 'd',
                    f71: 'f',
                    e72: 'e',
                    g73: 'g',
                    x74: 'xxx',
                    i7s: true,
                    l7ist: ['ok', 'go']
                    //map: {
                    //    o: 'pkpkpk'
                    //}
                };
                function getDropDownOptions(array){
                    if (!angular.isArray($scope.configuration[field]))
                        return;
                    for (var i = 0; i < array.length; i++){
                        array[i] = {
                            text: array[i],
                            value: array[i]
                        }
                    }
                    return array;
                }

                $scope.fields = [];


                for (field in $scope.configuration){
                    if (angular.isArray($scope.configuration[field])){
                        $scope.fields.push({
                            name: field,
                            type: 'array',
                            options: getDropDownOptions($scope.configuration[field]),
                            value: $scope.configuration[field]
                        });
                        var lastField = $scope.fields[$scope.fields.length-1];
                        lastField.value = $scope.configuration[field][0].value;
                        $scope.configuration[lastField.name] = lastField.value;
                    }
                    else {
                        $scope.fields.push({
                            name: field,
                            type: typeof($scope.configuration[field]),
                            value: $scope.configuration[field]
                        });
                    }
                }

                $scope.synchConfig = function(opt){
                    if (opt.type == 'number')
                        opt.value = parseInt(opt.value);
                    $scope.configuration[opt.name] = opt.value;
                };

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
