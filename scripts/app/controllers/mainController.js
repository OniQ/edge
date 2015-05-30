/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController', ['$scope', 'fileUploadService', '$modal', 'localStorageService', '$rootScope',
        function ($scope, fileUploadService, $modal, localStorageService, $rootScope) {
            //$scope.gameToLoad = "testBuild.json";

            $rootScope.workspace = Blockly.inject('blocklyDiv',
                {toolbox: document.getElementById('toolbox')});

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
                                options: localStorageService.get("builds")
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
        }]);
});
