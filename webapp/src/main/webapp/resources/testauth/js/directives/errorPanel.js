testauth.directive("errorPanel", function(){
    return {
        restrict:"A",
        scope:{
            // @ = always interpreted as String by angular
            errorList:'=',
            errorHeader:'@', // header message to display, if you want to override default
            warningList:'=',
            warningHeader:'@', // warning header message to display, if you want to override default
            alwaysExpanded:'@', // whether to display the +/- toggleable panel
            relativeWidth:'@' // whether the error panel should be the width of the page
        },
        transclude :true,
        templateUrl: 'resources/testauth/partials/error-panel.html',
        controller: function($scope, $attrs) {
            $scope.isAlwaysExpanded = function() {
                return $scope.alwaysExpanded == 'true';
            };

            $scope.isRelativeWidth = function() {
                return $scope.relativeWidth == 'true';
            };

            $scope.toggleErrors = function() {
                $scope.showErrors = !$scope.showErrors;
            };
            
            $scope.toggleWarnings = function() {
                $scope.showWarnings = !$scope.showWarnings;
            };

            $scope.showErrors = $scope.isAlwaysExpanded();
            $scope.showWarnings = $scope.isAlwaysExpanded();
        }
    };
});
