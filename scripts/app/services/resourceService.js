/**
 * Created by OniQ on 10/05/15.
 */
define(['edgeServices'], function(edgeServices){
    edgeServices.service('resourceService', function($q){
        var service = {};

        service.resources = {};

        service.addResource = function(name, type, data){
            var deferred = $q.defer();
            switch (type){
                case 'sprite':
                    var fileReader = new FileReader();
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