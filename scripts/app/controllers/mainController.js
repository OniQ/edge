/**
 * Created by OniQ on 20/04/15.
 */
define(['edgeCtrl'], function(edgeCtrl){
    edgeCtrl.controller('mainController', ['$scope',
        function ($scope) {
            $scope.data = "Data from scope";

            $scope.oneAtATime = false;
            $scope.items1 = ['Item1', 'Item2', 'Item3'];
            $scope.items2 = ['boo'];

            $scope.groups = [
                {
                    title: 'Dynamic Group Header - 1',
                    items: $scope.items1
                },
                {
                    title: 'Dynamic Group Header - 2',
                    items: $scope.items2
                }
            ];

        }]);
});