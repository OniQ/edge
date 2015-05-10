/**
 * Created by OniQ on 10/05/15.
 */
define(['edgeServices'], function(edgeServices){
    edgeServices.service('fileUploadService', function($q){
        var service = {};

        var DropBoxOAuthToken = "xsSYI8iCaMIAAAAAAAAJf40D4ejKgIMzI9fB5Eo6z1F6zxipAcx_fxIPYYDKCEJb";

        service.upload = function(file){
            var deferred = $q.defer();
            var oReq = new XMLHttpRequest();
            var url = 'https://api-content.dropbox.com/1/files_put/auto/' + file.name;
            oReq.responseType = "arraybuffer";
            oReq.open("PUT", url, true);
            oReq.setRequestHeader('Authorization', 'Bearer ' + DropBoxOAuthToken);
            oReq.onload = function (oEvent) {
                if (oEvent.currentTarget){
                    if (oEvent.currentTarget.status == 200)
                        deferred.resolve(oEvent.currentTarget);
                    else
                        deferred.reject(oEvent.currentTarget);
                }
            };
            oReq.send(file);
            return deferred.promise;
        };

        service.download = function(path){
            var deferred = $q.defer();
            var oReq = new XMLHttpRequest();
            var url = 'https://api-content.dropbox.com/1/files/auto/' + path;
            oReq.open("GET", url, true);
            oReq.setRequestHeader('Authorization', 'Bearer ' + DropBoxOAuthToken);
            oReq.responseType = "arraybuffer";
            oReq.onreadystatechange=function()
            {
                if (oReq.readyState==4 && oReq.status==200)
                {
                    var header = oReq.getResponseHeader("x-dropbox-metadata");
                    var metaData = JSON.parse(header);
                    var arrayBufferView = new Uint8Array( oReq.response );
                    var blob = new Blob([arrayBufferView], {type: metaData.mime_type});
                    blob.name = metaData.path.split('/').pop();
                    deferred.resolve(blob);
                }
            };
            oReq.onload = function (oEvent) {
                if (oEvent.currentTarget){
                    if (oEvent.currentTarget.status != 200)
                        deferred.reject(oEvent.currentTarget);
                }
            };
            oReq.send();
            return deferred.promise;
        };

        return service;
    });
});