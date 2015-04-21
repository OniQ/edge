/**
 * Created by OniQ on 20/04/15.
 */
require.config({
    baseUrl: "/edge/scripts",
    map:{
        // Maps
    },
    paths:{
        // Aliases and paths of modules
        "angular" : "lib/angular",
        "ngRoute" : "lib/angular-route",
        "edgeCtrl": "app/controllers/edgeControllers",
        "ctrl": "app/controllers",
        "ui-bootstrap": "lib/ui-bootstrap-tpls-0.12.1"
    },
    shim:{
        'angular': {
        },
        'edgeCtrl': {
            deps: ['angular']
        },
        'ngRoute': {
            deps: ['angular']
        },
        'ui-bootstrap':{
            deps: ['angular']
        },
        'edge': {
            deps: ['angular', 'ctrl/mainController', 'ui-bootstrap']
        }
    }
});

require(
    [
        'edge'
    ],
    function () {
        angular.bootstrap(document, ['edge']);
    });