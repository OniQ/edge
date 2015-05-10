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
                    $scope.dropComponent = function(){
                        var dropDeferred = $q.defer();
                        dropDeferred.reject();
                        var obj = angular.copy($scope.dragItem.item.config);
                        var promiseChains = [];
                        for (var key in obj) {
                            if (typeof obj[key] == 'object' && obj[key].type == 'sprite') {
                                var img = resourceService.resources[obj[key].name];
                                if(img)
                                    obj[key].image = img;
                                else {
                                    var deferred = $q.defer();
                                    promiseChains.push(deferred.promise);
                                    fileUploadService.download(obj[key].name).then(function (file) {
                                        resourceService.addResource(file.name, "sprite", file).then(function (image) {
                                            obj[key].image = image;
                                            //edge.attachObject(obj);
                                            deferred.resolve();
                                        }, function () {
                                            deferred.reject();
                                        })
                                    }, function () {
                                        deferred.reject();
                                    });
                                }
                            }
                        }

                        $q.all(promiseChains).then(function(){
                            edge.attachObject(obj);
                        });
                        return dropDeferred.promise;
                    };
                    edge.turnOn(canvas);
                    $interval(function(){
                        $rootScope.mouseState = edge.mouseState;
                    }, 100);
                });
            }
        };
    });
});
