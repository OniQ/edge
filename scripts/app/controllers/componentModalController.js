/**
 * Created by OniQ on 05/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){

    edgeCtrl.controller('componentModalController', ['$scope', 'data', 'fileUploadService', 'resourceService',
        function ($scope, data, fileUploadService, resourceService) {
            $scope.types = [
                {
                    text: 'list',
                    value: 'list'
                },
                {
                    text: 'boolean',
                    value: 'boolean'
                },
                {
                    text: 'number',
                    value: 'number'
                },
                {
                    text: 'string',
                    value: 'string'
                },
                {
                    text: 'sprite',
                    value: 'sprite'
                }
            ];

            $scope.model = {
                values : [''],
                type: 'string'
            };

            if (data.field) {
                $scope.model.name = data.field.name;
                $scope.model.type = data.field.value.type;
                $scope.editMode = true;
            }

            $scope.upload = function (files) {
                //if (files && files.length) {
                //    for (var i = 0; i < files.length; i++) {
                //        var file = files[i];
                //        fileUploadService.upload(file);
                //    }
                //}
            };

            $scope.addSprite = function(file, configName){
                fileUploadService.upload(file).then(function(){
                    data.configuration[configName].status = "loaded";
                }, function(){
                    data.configuration[configName].status = "failed";
                    throw new Error("File " + configName + " was not stored!");
                });

                resourceService.addResource(file.name, "sprite", file).then(function(image){

                });

                data.configuration[configName] = {
                    "type": "sprite",
                    "name": file.name,
                    "status": "loading"
                };
            };

            $scope.add = function(model){
                if (data.configuration) {
                    if (model.type === 'list')
                        data.configuration[model.name] = model.values;
                    else if (model.type === 'sprite'){
                        if (model.files && model.files.length){
                            var file = model.files[0];
                            $scope.addSprite(file, model.name);
                        }
                    }
                    else
                        data.configuration[model.name] = model.fieldValue;
                }
                $scope.$close(model.name);
            }
        }]);
});