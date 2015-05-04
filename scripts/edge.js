/**
 * Created by OniQ on 20/04/15.
 */
define([
    // Dependencies
    'ngRoute'
], function(
){
    var edge = angular.module('edge', ['ngRoute', 'edge.controllers',
        'edge.directives', 'ui.bootstrap', 'ngDragDrop', 'kendo.directives',
    'ui.bootstrap', 'LocalStorageModule']);

    edge.config(function($routeProvider, localStorageServiceProvider){

        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainController'
            })
            .otherwise({ redirectTo: "/" });

        localStorageServiceProvider
            .setPrefix('edge');
    });

    edge.run(function($rootScope){
        $rootScope.isResizable = false;
        $rootScope.canvasWidth = 640;
        $rootScope.canvasHeight = 480;
        $rootScope.autoSaveComponents = true;
    });

    return edge;
});
