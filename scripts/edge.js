/**
 * Created by OniQ on 20/04/15.
 */
define([
    // Dependencies
    'ngRoute',
    'ctrl'
], function(
){

    var edge = angular.module('edge', ['ngRoute', 'edge.controllers']);



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