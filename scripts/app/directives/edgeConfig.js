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

                $scope.synchConfig = function(opt){
                    var val = opt.value;
                    $scope.configuration[opt.name] = val;
                };

                $scope.removeField = function(field, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    delete $scope.configuration[field.name];
                };

                $scope.loadThumbnail = function(sprite){
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
                                        width: image.width
                                    }
                                }
                            }
                        });

                        modalInstance.result.then(function(type){

                        });
                    }, function(){
                        $scope.openingCollisionModal = false;
                    });
                };

                document.addEventListener("edgeObjectSelected", function(e) {
                    $scope.configuration = e.detail;
                });

                function processConfig(config){
                    if (config) {
                        $scope.fields = [];

                        for (field in config) {
                            $scope.fields.push({
                                name: field,
                                type: typeof(config[field]),
                                value: config[field]
                            });
                        }

                        var columnsCount = Math.ceil($scope.fields.length / 4.0);
                        var minimum = Math.min(4, columnsCount);
                        $scope.colClass = 'col-xs-' + 12 / minimum;
                        $scope.columns = [];
                        var size = $scope.fields.length / columnsCount;
                        while ($scope.fields.length > 0)
                            $scope.columns.push($scope.fields.splice(0, size));
                    }
                }

                $scope.$watch('configuration', function(newVal, oldVal){
                    processConfig(newVal);
                });
            }
        };
    });
});
