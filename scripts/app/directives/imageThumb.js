/**
 * Created by OniQ on 10/05/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('imageThumb', function($timeout, resourceService){
        return {
            scope: {
                file: "="
            },
            controller: function($scope, $element, $attrs) {
                $timeout(function(){
                    var file = resourceService.resources["_" + $scope.file.name];
                    if (file) {
                        switch($scope.file.type){
                            case "sprite":
                                var imageElement = angular.element(file);
                                imageElement.addClass("thumb");
                                $element.prepend(imageElement);
                                break;
                            case "audio":
                                file.controls = true;
                                var imageElement = angular.element(file);
                                imageElement.addClass("audioPreview");
                                $element.prepend(imageElement);
                                break;
                        }
                    }
                    else
                        $scope.file.status = "notLoaded";
                });
            }
        };
    });
});
