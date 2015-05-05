/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeComponents', function($http, $q, localStorageService,
                                                        $interval, $rootScope, $modal){
        return {
            templateUrl: "/edge/templates/panels/componentsPanel.html",
            controller: function($scope, $element, $attrs) {

                $scope.oneAtATime = false;

                $scope.groups = [];
                $scope.components = {
                    'default': [],
                    'custom': []
                };

                $scope.addField = function(){
                    if ($scope.configuration) {
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'modals/componentModal.html',
                            controller: 'componentModalController',
                            resolve: {
                                configuration: function () {
                                    return $scope.configuration;
                                }
                            }
                        });
                    }
                };

                var chain1 = $http.get('../data/components/default/test1.json').success(function(testComponent){
                    $scope.components.default.push({
                        content: testComponent,
                        name: 'Test1',
                        category: 'default'
                    });
                });

                var chain2 = $http.get('../data/components/default/test2.json').success(function(testComponent){
                    $scope.components.default.push({
                        content: testComponent,
                        name: 'Test2',
                        category: 'default'
                    });
                });

                $scope.addNewComponent = function(newComponentField){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'modals/inputModal.html',
                        controller: 'inputModalController',
                        resolve: {
                            data: function () {
                                return {
                                    title: 'Insert new component name',
                                    label: 'Name'
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(response){
                        $scope.customComponents[response] = {};
                        addGroupItem(response, 'custom');
                    });
                };

                function addGroupItem(prop, category) {
                    $scope.components[category].push({
                        content: $scope.customComponents[prop],
                        name: prop,
                        category: category
                    });
                }


                $scope.removeComponent = function(item, category){
                    delete $scope.customComponents[item.name];
                    $scope.components[category].splice($scope.components[category].indexOf(item), 1);
                };

                $scope.unbind = localStorageService.bind($scope, 'customComponents');

                for (var prop in $scope.customComponents) {
                    addGroupItem(prop, 'custom');
                }

                var componentLoadTasks = [chain1, chain2];
                $q.all(componentLoadTasks).then(function(){
                    for (var type in $scope.components) {
                        $scope.groups.push({
                            items: $scope.components[type],
                            title: type
                        });
                    }
                });

                $scope.changeConfigFile = function(selectedComponent){
                    $scope.selectedComponent = selectedComponent;
                    $scope.configuration = selectedComponent.content;
                }
            }
        };
    });
});
