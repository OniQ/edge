/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function(fileUploadService, resourceService, $interval, $timeout, $modal){
        return {
            templateUrl: "templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {

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

                $scope.synchConfig = function(name, val){
                    $scope.configuration[name] = val;
                };

                $scope.removeField = function(name, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    delete $scope.configuration[name];
                };

                $scope.loadThumbnail = function(sprite){
                    sprite.status = "loading";
                    fileUploadService.download(sprite.name, "xs").then(function(file){
                        resourceService.addResource("_" + file.name, "sprite", file).then(function(image){
                            sprite.status = "loaded";
                        }, function(){
                            sprite.status = "failed";
                        })
                    }, function(){
                        sprite.status = "failed";
                    });
                };

                $scope.setCollisionBox = function(value){
                    $scope.openingCollisionModal = true;
                    resourceService.getResource(value.name, "sprite").then(function(image){
                        scrollTo(0,0);
                        $scope.openingCollisionModal = false;
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'templates/modals/areaSelectModal.html',
                            controller: 'areaSelectModalController',
                            //size: 'lg',
                            resolve: {
                                data: function () {
                                    return {
                                        src: image.src,
                                        height: image.height,
                                        width: image.width,
                                        collisionBox: $scope.configuration["collisionBox"]
                                    }
                                }
                            }
                        });

                        modalInstance.result.then(function(collisionBox){
                            $scope.configuration["collisionBox"] = collisionBox;
                        });
                    }, function(){
                        $scope.openingCollisionModal = false;
                    });
                };

                document.addEventListener("edgeObjectSelected", function(e) {
                    $scope.configuration = e.detail;
                });

                $scope.getType = function(config){
                    var type = typeof(config);
                    return type;
                }
            }
        };
    });
});
