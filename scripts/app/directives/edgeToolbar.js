/**
 * Created by OniQ on 22/04/15.
 */
define(['edgeDirectives'], function(edgeDirectives){
    edgeDirectives.directive('edgeToolbar', function($compile, $timeout){
        return {
            templateUrl: "/edge/templates/panels/toolbar.html",
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        var buttons = iElement.context.children;
                        angular.forEach(buttons, function (button) {
                            if (button.attributes['name']) {
                                var name = button.attributes['name'].nodeValue;
                                var tooltipWrapper = "<div tooltip='" + name + "'" +
                                    " tooltip-placement='right' style='display: inline-block' tooltip-popup-delay='700'>"
                                    + "</div>";
                                angular.element(button).wrap(tooltipWrapper);
                                $compile(iElement.contents())(scope);
                            }
                        });
                    }
                }
            }
        };
    });
});
