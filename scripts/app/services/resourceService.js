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
                    service.addResource(file.name, type, file).then(function (image) {
                        deferred.resolve(image);
                    }), deferred.reject;
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
            }
            return deferred.promise;
        };

        return service;
    });
});