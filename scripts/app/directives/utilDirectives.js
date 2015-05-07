/**
 * Created by OniQ on 07/05/15.
 */
define(['edgeDirectives'], function(edgeDirectives) {
    edgeDirectives.directive('focusMe', function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });

                element.bind('blur', function () {
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    });
});