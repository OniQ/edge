/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController', ['$scope',
        function ($scope) {
            $scope.data = "Data from scope";
        }]);
});
