/**
 * Created by OniQ on 10/05/15.
 */
define(['edgeServices'], function(edgeServices){
    edgeServices.service('resourceService', function($q, fileUploadService){
        var service = {};

        service.resources = {};

        service.getResource = function(name, type){
            var deferred = $q.defer();
            var resource = service.resources[name];
            if (resource)
                deferred.resolve(resource);
            else
                fileUploadService.download(name).then(function(file){
                    switch (type){
                        case "sprite":
                            service.addResource(file.name, type, file).then(function (image) {
                                deferred.resolve(image);
                            }), deferred.reject;
                            break;
                        case "function":
                            var fileReader = new FileReader();
                            fileReader.readAsText(file);
                            fileReader.onload = function(e) {
                                service.resources[name] = e.target.result;
                                deferred.resolve(service.resources[name]);
                            };
                    }

                }, deferred.reject);
            return deferred.promise;
        };

        service.addResource = function(name, type, data){
            var deferred = $q.defer();
            var fileReader = new FileReader();
            switch (type){
                case 'sprite':
                    fileReader.readAsDataURL(data);
                    fileReader.onload = function(e) {
                        var image = new Image();
                        image.src = e.target.result;
                        service.resources[name] = image;
                        deferred.resolve(image);
                    };
                    break;
                case 'audio':
                    fileReader.readAsDataURL(data);
                    fileReader.onload = function(e) {
                        var audio = new Audio();
                        audio.src = e.target.result;
                        service.resources[name] = audio;
                        deferred.resolve(audio);
                    };
                    break;
                case 'function':
                    service.resources[name] = data;
                    deferred.resolve(service.resources[name]);
            }
            return deferred.promise;
        };

        return service;
    });
});