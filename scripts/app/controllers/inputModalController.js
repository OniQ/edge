/**
 * Created by OniQ on 05/05/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('inputModalController', ['$scope', 'data',
        function ($scope, data) {
            $scope.data = data;

            $scope.submit = function(data){
                $scope.$close(data.value);
            }

        }]);
});