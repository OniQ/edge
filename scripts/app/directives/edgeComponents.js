/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeComponents', function($http, $q, localStorageService,
                                                        $interval, $rootScope, $modal,
                                                        $timeout){
        return {
            templateUrl: "templates/panels/componentsPanel.html",
            controller: function($scope, $element, $attrs) {

                $scope.oneAtATime = false;

                $scope.loadDefault = function(){
                    var defaultComponents = [];
                    $scope.categories['default'] = [];
                    var chain1 = $http.get('data/components/default/test1.json').success(function(testComponent){
                        defaultComponents.push({
                            config: testComponent,
                            name: 'Test1'
                        });
                    });

                    var chain2 = $http.get('data/components/default/test2.json').success(function(testComponent){
                        defaultComponents.push({
                            config: testComponent,
                            name: 'Test2'
                        });
                    });

                    var promiseChains = [chain1, chain2];
                    $q.all(promiseChains).then(function(){
                        angular.forEach(defaultComponents, function(component){
                            $scope.categories['default'].push(component);
                        })
                    });
                };

                var edgeStorage = localStorageService.get('categories');
                if (!edgeStorage)
                    localStorageService.set('categories', {});
                $scope.unbind = localStorageService.bind($scope, 'categories');
                if (!edgeStorage)
                    $scope.loadDefault();

                $scope.$watch('isDefaultComponentsHidden', function(val){
                    if (val){
                        delete $scope.categories['default'];
                    }
                    else{
                        if ($scope.categories && !$scope.categories['default'])
                            $scope.loadDefault();
                    }
                });

                $scope.addCategory = function(){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'templates/modals/inputModal.html',
                        controller: 'inputModalController',
                        resolve: {
                            data: function () {
                                return {
                                    title: 'New category',
                                    label: 'Name'
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(type){
                        $scope.categories[type] = [];
                    });
                };

                $scope.addField = function(field){
                    if ($scope.configuration) {
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl:'templates/modals/componentModal.html',
                            controller: 'componentModalController',
                            resolve: {
                                data: function () {
                                    return {
                                        configuration: $scope.configuration,
                                        field: field
                                    }
                                }
                            }
                        });
                    }
                    modalInstance.result.then(function(response){
                        if (angular.isObject($scope.configuration[response]) && $scope.configuration[response].type == 'sprite')
                            $scope.loadThumbnail($scope.configuration[response]);
                    });
                };

                $scope.addNewComponent = function(category){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'templates/modals/inputModal.html',
                        controller: 'inputModalController',
                        resolve: {
                            data: function () {
                                return {
                                    title: 'New component',
                                    label: 'Name'
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(response){
                        $scope.categories[category].push({
                            config: {},
                            name: response
                        });
                    });
                };

                $scope.removeComponent = function(category, item){
                    $scope.categories[category].splice($scope.categories[category].indexOf(item), 1);
                };

                $scope.removeCategory = function(category, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    delete $scope.categories[category];
                };

                $scope.beforeDrop = function(ev, ui, category) {
                    var deferred = $q.defer();

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl:'templates/modals/inputModal.html',
                        controller: 'inputModalController',
                        resolve: {
                            data: function () {
                                return {
                                    title: 'Duplicate component',
                                    label: 'Name',
                                    defaultValue: $scope.dragItem.item.name
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(response){
                        var duplicatedComponent = angular.copy($scope.dragItem.item);
                        duplicatedComponent.name = response;
                        $scope.categories[category].push(duplicatedComponent);
                    }).finally(deferred.reject);

                    return deferred.promise;
                };

                $scope.startDrag = function(event, ui, category, item){
                    $scope.dragItem = {
                        item: item,
                        category:category
                    }
                };

                $scope.changeConfigFile = function(selectedComponent, category){
                    $scope.selectedComponent = selectedComponent;
                    $scope.configuration = selectedComponent.config;
                    $scope.selectedCategory = category;
                }
            }
        };
    });
});
