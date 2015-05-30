/**
 * Created by OniQ on 30/05/15.
 */
define(['edgeServices'], function(edgeServices){
    edgeServices.service('functionService', function(fileUploadService, resourceService) {
        var service = {};

        service.addFunction = function(configuration, configName, name, code){
            var blob = new Blob([code], {type: "octet/stream"});
            fileUploadService.upload(name + '.txt', blob).then(function(){
                configuration[configName].status = "loaded";
            });
            resourceService.addResource(name + '.txt', "function", code);
            configuration[configName] = {
                name: name,
                type: 'function',
                code: code,
                status: "loading"
            };
        };

        return service;
    })
});