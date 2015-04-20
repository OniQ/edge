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
        "ctrl" : "app/controllers/controllers",
        "edgeCtrl": "app/controllers/edgeControllers"
    },
    shim:{
        'angular': {
        },
        'ngRoute': {
            deps: ['angular']
        },
        'edge': {
            deps: ['angular', 'ctrl']
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