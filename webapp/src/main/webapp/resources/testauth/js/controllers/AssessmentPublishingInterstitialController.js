testauth.controller('AssessmentPublishingInterstitialController',['$scope','$state', '$timeout',
      function($scope, $state, $timeout) {

	$timeout(function() {
		$state.transitionTo("assessmenthome.publishinghome.publishingview", {assessmentId:$scope.assessment.id});
	});
}]);
