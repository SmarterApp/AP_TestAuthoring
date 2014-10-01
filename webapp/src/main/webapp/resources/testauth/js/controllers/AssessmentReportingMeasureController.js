testauth.controller('AssessmentReportingMeasureController',['$scope','$state', 'loadedData', 'loadedBlueprintReferenceTypes', 'scoringRuleList', 'ReportingMeasureService',
    function($scope, $state, loadedData, loadedBlueprintReferenceTypes, scoringRuleList, ReportingMeasureService) {
		$scope.errors = loadedData.errors;
		$scope.blueprintReferenceTypes = loadedBlueprintReferenceTypes.data;

		$scope.assessment = loadedData.data;
		$scope.scoringRuleCreated = scoringRuleList.data && scoringRuleList.data.totalCount > 0;

		if (!$state.current.searchParams) {
            $scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "currentPage": 1, "pageSize":50};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchReportingMeasures = function(params) {
            return ReportingMeasureService.search(params);
        };
        
        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.reportingMeasureId = "";
            $state.transitionTo("assessmenthome.reportingmeasureedit", params);
        };

        $scope.view = function(reportingMeasure) {
            $state.transitionTo("assessmenthome.reportingmeasureedit", {assessmentId:$scope.assessment.id, reportingMeasureId:reportingMeasure.id});
        };
        
        $scope.remove = function(reportingMeasure) {
            if (confirm("Are you sure you want to delete this Reporting Measure?")) {
                ReportingMeasureService.remove(reportingMeasure).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-reportingmeasure-search');
                    }
                });
            };
        };
	}
]);
