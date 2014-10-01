testauth.controller('AssessmentItemPoolController',['$scope','$state', '$filter', 'loadedData',
    function($scope, $state, $filter, loadedData) {
        $scope.assessment = loadedData.data;
        $scope.activeLink = $state.$current.self.name;

        $scope.isActiveLink = function(link){
            return  $scope.activeLink.indexOf(link) == 0; 
        };
               	 
        $scope.goToItemPoolPage = function(event, tabLink) {
        	if(event.keyCode && event.keyCode !== 13) {
        		return false;
        	}
            $state.transitionTo(tabLink, {assessmentId:$scope.assessment.id});
            $scope.activeLink = tabLink;
        };
}]);
