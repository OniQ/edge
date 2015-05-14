/**
 * Created by OniQ on 20/04/15.
 */
require.config({
    baseUrl: "scripts",
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
        "edgeDirectives": "app/modules/edgeDirectives",
        "edgeServices": "app/modules/edgeServices"
    },
    shim:{
        'edge': {
            deps: ['ctrl/mainController', 'ctrl/componentModalController',
                'ctrl/inputModalController', 'ctrl/areaSelectModalController',
                'ui-bootstrap', 'dragdrop', 'lib/area-select',
                'app/directives/edgeComponents', 'app/directives/edgeConfig',
                'app/directives/edgeToolbar', 'app/directives/edgeDisplay',
                'app/directives/utilDirectives', 'lib/angular-local-storage',
                'lib/ng-file-upload', 'app/services/fileUploadService',
                'app/services/resourceService', 'app/directives/imageThumb'
            ]
        },
        'edgeCore':{
            deps: ['edgeEditor', 'lib/webgl-utils']
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
