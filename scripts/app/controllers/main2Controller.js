/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController2', ['$scope', 'fileUploadService', '$modal', 'localStorageService', '$rootScope',
        '$timeout', '$interval',
        function ($scope, fileUploadService, $modal, localStorageService, $rootScope, $timeout, $interval) {
            //$scope.gameToLoad = "testBuild.json";

            $scope.loadGame = function(){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'templates/modals/inputModal.html',
                    controller: 'inputModalController',
                    resolve: {
                        data: function () {
                            return {
                                title: 'Load game',
                                label: 'Select build',
                                type: "list",
                                options: localStorageService.get("builds"),
                                defaultValue: localStorageService.get("builds")[0]
                            }
                        }
                    }
                });

                modalInstance.result.then(function(build){
                    edge.turnOn(null, build + '.json');
                });
            };

            $scope.buildGame = function(){
                for (var i = 0; i < edge.gameObjects.length; i++) {
                    var objects = edge.gameObjects[i];
                    for (var key in objects) {
                        if (typeof objects[key] == 'object' && objects[key].type == 'sprite') {
                            objects[key].image = null;
                        }
                    }
                }
                var json = JSON.stringify(edge.gameObjects);
                var blob = new Blob([json], {type: "octet/stream"});
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'templates/modals/inputModal.html',
                    controller: 'inputModalController',
                    resolve: {
                        data: function () {
                            return {
                                title: 'Build name',
                                label: 'Name'
                            }
                        }
                    }
                });

                modalInstance.result.then(function(path){
                    fileUploadService.upload(path + '.json', blob);
                    var builds = localStorageService.get("builds") || [];
                    if (builds.indexOf(path) == -1)
                        builds.push(path);
                    localStorageService.set("builds", builds);
                });

            }

            function setBlocklyStyle(){
                var result = document.getElementsByClassName("middleComponent");
                var width = 35;
                for (var i = 0; i < result.length; i++){
                    width += angular.element(result[i]).width();
                }

                $scope.blocklyStyle = {
                    'position': 'absolute',
                    'left': width + "px"
                };
            }

            function setComponentsHeight(){
                var result = document.getElementsByClassName("middleComponent");
                $scope.componentsStyle = {
                    'height': angular.element(result[0]).height()
                };
            }

            $timeout(function(){
                setComponentsHeight();
                setBlocklyStyle();
                $interval(setBlocklyStyle, 500);
                if ($scope.blocklyStyle) {
                    $timeout(function () {
                        $rootScope.workspace = Blockly.inject('blocklyDiv',
                            {toolbox: document.getElementById('toolbox')});
                    });
                }
            });

        }]);
});
