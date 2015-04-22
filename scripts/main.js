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
        "ui-bootstrap": "lib/ui-bootstrap-tpls-0.12.1",
        "dragdrop": "lib/angular-dragdrop",
        "jquery": "lib/jquery-1.11.2",
        "jquery-ui": "lib/jquery-ui"
    },
    shim:{
        'jquery': {
            'exports': 'jQuery'
        },
        'jquery-ui': {
            'deps': ['jquery']
        },
        'angular': {
            'exports': 'angular',
            'deps': ['jquery', 'jquery-ui']
        },
        'jquery-ui':{
            deps: ['jquery']
        },
        'dragdrop':{
            deps: ['angular']
        },
        'ui-bootstrap':{
            deps: ['angular']
        },
        'ctrl/mainController':{
            deps: ['angular']
        },
        'edge': {
            deps: ['angular', 'ctrl/mainController',
                'ui-bootstrap', 'dragdrop']
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