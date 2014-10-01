testauth.controller('NavigationController', ['$scope','$state','NavigationService',
    function NavigationController($scope,$state, NavigationService) {
        $scope.navLinks = NavigationService.getNavLinks();
        $scope.navigate = function(navLink) {
            $state.transitionTo(navLink.stateName);
        };
    }
]);