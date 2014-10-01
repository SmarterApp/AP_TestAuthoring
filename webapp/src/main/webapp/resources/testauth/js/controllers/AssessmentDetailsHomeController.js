testauth.controller('AssessmentDetailsHomeController',['$scope','$state',
      function($scope, $state) {
  	
	 $scope.activeLink = $state.$current.self.name;
	 
	 $scope.isActiveLink = function(link){
		return  $scope.activeLink.indexOf(link) == 0; 
	 };
	 
	 $scope.goToSubPage = function(event, tabLink) {
		 if(event.keyCode && event.keyCode !== 13) {
			 return false;
		 }
         $state.transitionTo(tabLink, {assessmentId:$scope.assessment.id});
         $scope.activeLink = tabLink;
     };
     
}]);
