/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeComponents', function($http, $q, localStorageService,
                                                        $interval, $rootScope){
        return {
            templateUrl: "/edge/templates/panels/componentsPanel.html",
            controller: function($scope, $element, $attrs) {

                $scope.oneAtATime = false;

                $scope.groups = [];
                $scope.components = {
                    'default': [],
                    'custom': []
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

                //localStorageService.set('customComponents',
                //    {
                //        "storageTest" : {"a" : "a"}
                //    }
                //);

                var customComponents = localStorageService.get('customComponents');

                $interval(function () {
                    if ($rootScope.autoSaveComponents == true)
                        localStorageService.set('customComponents', customComponents);
                }, 100);

                for (var prop in customComponents) {
                    $scope.components['custom'].push({
                        content: customComponents[prop],
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
                    $scope.configuration = selectedComponent.content;
                }
            }
        };
    });
});
