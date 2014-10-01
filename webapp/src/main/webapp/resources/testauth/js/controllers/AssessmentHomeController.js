testauth.controller('AssessmentHomeController',['$scope','$state', 'loadedData', 'AssessmentService','$location',
    function($scope, $state, loadedData, AssessmentService, $location) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
		$scope.activeTab = $state.$current.self.name;

		if($scope.activeTab == "assessmenthome.simulation" 
			|| $scope.activeTab == "assessmenthome.publishinghome.publishing"
			|| $scope.activeTab == "assessmenthome.psychometric" ){
			$scope.isPostTest = true;
		}
		$scope.showPostTest = function (postTest, disabled) {
			$scope.isPostTest = postTest;
			if(!disabled) {
				if(postTest) {
					$location.path("/assessmenthome/" + $scope.assessment.id +"/simulation");
					$scope.activeTab ="assessmenthome.simulation";
				} else {
					$scope.activeTab ="assessmenthome.detailhome.edit";
					$state.transitionTo("assessmenthome.detailhome.edit", {assessmentId:$scope.assessment.id});
				}					
			}	
		};
		
		$scope.showPostTestEnter = function(postTest, disabled) {
			if(event.keyCode === 13) {
				$scope.showPostTest(postTest, disabled);
			};
		};
		
		$scope.resetAssessment = function(assessment) {
		    $scope.assessment = assessment;
		    loadedData.data = assessment;
		};

		 
		 $scope.isActive = function(link){
			return  $scope.activeTab.indexOf(link) == 0; 
		 };
		 
		 $scope.goToTab = function(event, tabLink) {
			 if(event.keyCode && event.keyCode !== 13) {
				 return false;
			 }
	         $state.transitionTo(tabLink, {assessmentId:$scope.assessment.id}).then(function(response) {
	             $scope.activeTab = tabLink;
	         });
	     };
	     
		$scope.goToTabEnter = function(event, path) {
			if(event.keyCode === 13) {
				$scope.goToTab(path);
			};
		};
	     
		$scope.cancel = function() {
			$state.transitionTo("assessmentsearch");
		};
        

	}]);

