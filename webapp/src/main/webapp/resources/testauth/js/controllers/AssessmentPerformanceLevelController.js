testauth.controller('AssessmentPerformanceLevelController',['$scope','$state', 'loadedData', 'loadedBlueprintReferenceTypes', 'PerformanceLevelService',
    function($scope, $state, loadedData, loadedBlueprintReferenceTypes, PerformanceLevelService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
		$scope.blueprintReferenceTypes = loadedBlueprintReferenceTypes.data;
		$scope.selectedCellId = "view0";
		
		if (!$state.current.searchParams) {
            $scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "sortKey":"blueprintReferenceType,blueprintReferenceName", "sortDir":"asc", "currentPage": 1, "pageSize":10};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchPerformanceLevels = function(params) {
            return PerformanceLevelService.search(params);
        };
        
        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.performanceLevelId = "";
            $state.transitionTo("assessmenthome.performanceleveledit", params);
        };

        $scope.view = function(performanceLevel) {
            $state.transitionTo("assessmenthome.performanceleveledit", {assessmentId:$scope.assessment.id, performanceLevelId:performanceLevel.id});
        };
        
        $scope.remove = function(performanceLevel) {
            if (confirm("Are you sure you want to delete this performance level?")) {
                PerformanceLevelService.remove(performanceLevel).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-performancelevel-search');
                    }
                });
            };
        };
	}
]);
