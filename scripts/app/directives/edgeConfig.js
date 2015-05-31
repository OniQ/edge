/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeConfig', function(fileUploadService, resourceService, $interval, $timeout, $modal,
                                                    $rootScope, functionService, localStorageService){
        return {
            templateUrl: "templates/panels/configPanel.html",
            controller: function($scope, $element, $attrs) {

                var workspace = localStorageService.get('workspace');
                if (!workspace)
                    localStorageService.set('workspace', {});
                $scope.unbind = localStorageService.bind($scope, 'workspace');

                $scope.setFunction = function(name, fn){
                    var code = Blockly.JavaScript.workspaceToCode($rootScope.workspace);
                    fn.code = code;
                    var xml = Blockly.Xml.workspaceToDom( Blockly.mainWorkspace );
                    localStorage.setItem("block_" + fn.name ,Blockly.Xml.domToText( xml ));
                    functionService.addFunction($scope.configuration, name, fn.name, fn.code);
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

                $scope.loadBlocklyWorkspace = function(name, config){
                    var xmlText = localStorage["block_" + config.name];
                    var xml = Blockly.Xml.textToDom(xmlText);
                    if(xml)
                        Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
                };

                $scope.loadThumbnail = function(resource){
                    resource.status = "loading";
                    var thumbSize = resource.type === "sprite" ? "xs" : null;
                    fileUploadService.download(resource.name, thumbSize).then(function(file){
                        resourceService.addResource("_" + file.name, resource.type, file).then(function(image){
                            resource.status = "loaded";
                        }, function(){
                            resource.status = "failed";
                        })
                    }, function(){
                        resource.status = "failed";
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
