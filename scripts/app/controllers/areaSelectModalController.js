/**
 * Created by OniQ on 14/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('areaSelectModalController', ['$scope', 'data',
        function ($scope, data) {
            $scope.spriteSrc = data.src;
            $scope.collisionBoxes = [];
            $scope.removeLast = function(index){
                $scope.collisionBoxes.splice(index, 1);
            };
            $scope.width = data.width + "px";
            $scope.height = data.height + "px";
            $scope.submit = function(data){
                $scope.$close();
            }
        }]);
});