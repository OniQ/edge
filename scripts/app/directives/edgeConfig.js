/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function($timeout){
        return {
            templateUrl: "/edge/templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {

                $scope.synchConfig = function(opt){
                    if (opt.type == 'number')
                        opt.value = parseInt(opt.value);
                    $scope.configuration[opt.name] = opt.value;
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

                $scope.$watch('configuration', function(newVal, oldVal){
                    if (newVal){
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

                        var columnsCount = Math.ceil($scope.fields.length / 4.0);
                        var minimum = Math.min(4, columnsCount);
                        $scope.colClass = 'col-xs-' + 12 / minimum;
                        $scope.columns = [];
                        var size = $scope.fields.length/columnsCount;
                        while ($scope.fields.length > 0)
                            $scope.columns.push($scope.fields.splice(0, size));
                    }
                }, true);
            }
        };
    });
});
