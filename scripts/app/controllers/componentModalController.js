/**
 * Created by OniQ on 05/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('componentModalController', ['$scope', 'configuration',
        function ($scope, configuration) {
            $scope.types = [
                {
                    text: 'list',
                    value: 'list'
                },
                {
                    text: 'boolean',
                    value: 'boolean'
                },
                {
                    text: 'number',
                    value: 'number'
                },
                {
                    text: 'string',
                    value: 'string'
                }
            ];

            $scope.model = {
                values : [''],
                type: 'string'
            };

            $scope.add = function(model){
                if (configuration) {
                    if (model.type === 'list')
                        configuration[model.name] = model.values;
                    else
                        configuration[model.name] = model.fieldValue;
                }
                $scope.$close(true);
            }
        }]);
});