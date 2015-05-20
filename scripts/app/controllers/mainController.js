/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController', ['$scope', 'fileUploadService', '$modal',
        function ($scope, fileUploadService, $modal) {
            //$scope.gameToLoad = "testBuild.json";

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
                    fileUploadService.upload(path, blob);
                });

            }
        }]);
});
