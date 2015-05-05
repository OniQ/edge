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

                $scope.addComponent = function(){
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
                        name: 'Test1'
                    });
                });

                var chain2 = $http.get('../data/components/default/test2.json').success(function(testComponent){
                    $scope.components.default.push({
                        content: testComponent,
                        name: 'Test2'
                    });
                });

                $scope.addNewComponent = function(newComponent){
                    $scope.customComponents[newComponent.name] = {};
                };

                $scope.unbind = localStorageService.bind($scope, 'customComponents');

                for (var prop in $scope.customComponents) {
                    $scope.components['custom'].push({
                        content: $scope.customComponents[prop],
                        name: prop
                    });
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
