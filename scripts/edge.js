/**
 * Created by OniQ on 20/04/15.
 */
define([
    // Dependencies
    'ngRoute'
], function(
){
    var edge = angular.module('edge', ['ngRoute', 'edge.controllers', 'ui.bootstrap']);

    edge.config(function($routeProvider){

        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainController'
            })
            .otherwise({ redirectTo: "/" });
    });

    return edge;
});