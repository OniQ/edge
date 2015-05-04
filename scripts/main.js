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
        "edgeCtrl": "app/modules/edgeControllers",
        "ctrl": "app/controllers",
        "ui-bootstrap": "lib/ui-bootstrap-tpls-0.12.1",
        "dragdrop": "lib/angular-dragdrop",
        "jquery": "lib/jquery-1.11.2",
        "jquery-ui": "lib/jquery-ui",
        "edgeDirectives": "app/modules/edgeDirectives"
    },
    shim:{
        'edge': {
            deps: ['ctrl/mainController',
                'ui-bootstrap', 'dragdrop', 'lib/kendo.all.min',
                'app/directives/edgeComponents', 'app/directives/edgeConfig',
                'app/directives/edgeToolbar', 'app/directives/edgeDisplay',
                'lib/angular-local-storage']
        },
        'edgeCore':{
            deps: ['edgeEditor']
        }
    }
});

require(
    [
        'edgeCore',
        'edge'
    ],
    function () {
        angular.bootstrap(document, ['edge']);
    });
