testauth.controller('HomeController', ['$scope','$location', '$state', 'AssessmentService', 'VersionService',
     function HomeController($scope,$location, $state, AssessmentService, VersionService) {
		
		VersionService.getBuildInfo().then(function(response) {
		    $scope.buildInfo = response.data;
		});
		
		$scope.slidePage = function (path) {
			$location.path(path);			
		};
		$scope.slidePageEnter = function(event, path) {
			if(event.keyCode === 13) {
				$location.path(path);
			}
		};
		
		$scope.expandSystemsDropdown = function() {
			debugger;
			document.getElementById("systemsDropdown").addParameter("display", "block");
		};
		
	    $scope.go = function(path){
	    	if (path == "/home") {
	    		$location.path(path);
	    	} else {
	    		 if (AssessmentService.getCache()) {
	    			 $scope.assessment = AssessmentService.getCache();
	    			 $state.transitionTo(path, {assessmentId:$scope.assessment.id});
	    			 $scope.activeTab = path;
	    		 } else {
	    			 $state.transitionTo(path);
	    		 }
	    	}
		};
		
		$scope.goEnter = function(event, path) {
			if(event.keyCode === 13) {
				$scope.go(path);
			};
		};
}]);