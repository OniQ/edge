/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeDisplay', function($timeout, $rootScope, $interval, $q,
                                                     fileUploadService, resourceService){
        return {
            controller: function($scope, $element, $attrs) {
                $timeout(function(){
                    var canvas = $element.context;
                    $scope.appendImage = function(obj, key, img){
                        //obj[key].image = img;
                        edge.addResource(obj[key].name, img);
                        obj.width = obj.width || img.width;
                        obj.height = obj.height || img.height;
                        obj.x = obj.x - obj.width / 2;
                        obj.y = obj.y - obj.height / 2;
                    };

                    $scope.getResourceTask = function(obj, key, type){
                        var deferred = $q.defer();
                        fileUploadService.download(obj[key].name).then(function (file) {
                            resourceService.addResource(file.name, type, file).then(function (resource) {
                                if (type == "sprite")
                                    $scope.appendImage(obj, key, resource);
                                deferred.resolve();
                            }, function () {
                                deferred.reject();
                            })
                        }, function () {
                            deferred.reject();
                        });
                        return deferred.promise;
                    };

                    $scope.dropComponent = function(){
                        var dropDeferred = $q.defer();
                        dropDeferred.reject();
                        var obj = angular.copy($scope.dragItem.item.config);
                        var promiseChains = [];
                        for (var key in obj) {
                            if (typeof obj[key] == 'object' ) {
                                if (obj[key].type == 'sprite') {
                                    var img = resourceService.resources[obj[key].name];
                                    obj.x = edge.mouseState.x;
                                    obj.y = edge.mouseState.y;
                                    if (img) {
                                        $scope.appendImage(obj, key, img);
                                    }
                                    else {
                                        promiseChains.push($scope.getResourceTask(obj, key, "sprite"));
                                    }
                                }
                                else if (obj[key].type == 'sprite'){
                                    var resource = resourceService.resources[obj[key].name];

                                    if (resource) {
                                        edge.addResource(obj[key].name, resource);
                                    }
                                    else {
                                        promiseChains.push($scope.getResourceTask(obj, key, obj[key].type));
                                    }
                                }
                            }
                        }

                        $q.all(promiseChains).then(function(){
                            edge.attachObject(obj);
                        });
                        return dropDeferred.promise;
                    };
                    edge.editorEnabled = true;
                    edge.turnOn(canvas);
                    $interval(function(){
                        $rootScope.mouseState = edge.mouseState;
                    }, 100);
                });
            }
        };
    });
});
