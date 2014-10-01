
testauth.controller('AssessmentApprovalHistoryController', ['$scope', '$state', 'loadedData', 'ApprovalService',
	function ($scope, $state, loadedData, ApprovalService) {
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.assessment = loadedData.data;

		if (!$state.current.searchParams) {
			$scope.searchParams = {"assessmentId": $scope.assessment.id, "sortKey":"lastUpdatedDate", "sortDir":"DESC", "pageSize" : 10, "currentPage": 1};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};
  		
  		$scope.searchApprovals = function(params) {
  			return ApprovalService.search(params);
  		};
  		
}]);
