/**
 * Created by OniQ on 10/05/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('imageThumb', function($timeout, resourceService){
        return {
            scope: {
                image: "="
            },
            controller: function($scope, $element, $attrs) {
                $timeout(function(){
                    var image = resourceService.resources["_" + $scope.image.name];
                    if (image) {
                        var imageElement = angular.element(image);
                        imageElement.addClass("thumb");
                        $element.prepend(imageElement);
                    }
                    else
                        $scope.image.status = "notLoaded";
                });
            }
        };
    });
});
