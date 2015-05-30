/**
 * Created by OniQ on 05/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){

    edgeCtrl.controller('componentModalController', ['$scope', 'data', 'fileUploadService', 'resourceService', 'functionService',
        function ($scope, data, fileUploadService, resourceService, functionService) {
            $scope.types = [
                'list', 'boolean', 'number',  'string', 'sprite', 'audio', 'function'
            ];

            $scope.model = {
                values : [''],
                type: 'string'
            };

            $scope.addFunction = functionService.addFunction;

            if (data.field) {
                $scope.model.name = data.field.name;
                $scope.model.type = data.field.type;
                $scope.model.fnName = data.field.fnName;
                $scope.model.fieldValue = data.field.fnCode;
                if ($scope.model.name)
                    $scope.editMode = true;
            }

            $scope.upload = function (files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var audio = new Audio();
                        var reader  = new FileReader();

                        reader.onloadend = function () {
                            audio.src = reader.result;
                            audio.controls = true;
                            var audioElement = angular.element("#audioPreview");
                            angular.element(audioElement[0]).replaceWith(audio);
                        }

                        if (file) {
                            reader.readAsDataURL(file);
                        } else {
                            audio.src = "";
                        }
                    }
                }
            };

            $scope.addFile = function(file, configName, type){
                fileUploadService.upload(file.name, file).then(function(){
                    data.configuration[configName].status = "loaded";
                }, function(){
                    data.configuration[configName].status = "failed";
                    throw new Error("File " + configName + " was not stored!");
                });

                resourceService.addResource(file.name, type, file).then(function(image){

                });

                data.configuration[configName] = {
                    "type": type,
                    "name": file.name,
                    "status": "loading"
                };
            };

            $scope.add = function(model){
                if (data.configuration) {
                    if (model.type === 'list') {
                        data.configuration[model.name] = {
                            name: model.name,
                            type: 'array',
                            options: model.values,
                            selected: model.values[0]
                        };
                    }
                    else if (model.type === 'sprite' || model.type === 'audio'){
                        if (model.files && model.files.length){
                            var file = model.files[0];
                            $scope.addFile(file, model.name, model.type);
                        }
                    }
                    else if (model.type === 'function'){
                        $scope.addFunction(data.configuration, model.name, model.fnName, model.fieldValue)
                    }
                    else
                        data.configuration[model.name] = model.fieldValue;
                }
                $scope.$close(model.name);
            }
        }]);
});