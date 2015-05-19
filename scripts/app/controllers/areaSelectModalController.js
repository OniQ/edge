/**
 * Created by OniQ on 14/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('areaSelectModalController', ['$scope', 'data', '$timeout',
        function ($scope, data, $timeout) {
            $scope.spriteSrc = data.src;
            $scope.width = data.width + "px";
            $scope.height = data.height + "px";
            $scope.collisionBox = angular.copy(data.collisionBox);
            //$scope.removeLast = function(index){
            //    $scope.collisionBoxes.splice(index, 1);
            //};
            $scope.pushCoords = function(){
                $timeout(function() {
                    //$scope.collisionBoxes.push($scope.coords.select)
                    $scope.collisionBox = $scope.coords.select;
                });
            };
            $scope.submit = function(){
                $scope.$close($scope.collisionBox);
            }
        }]);
});