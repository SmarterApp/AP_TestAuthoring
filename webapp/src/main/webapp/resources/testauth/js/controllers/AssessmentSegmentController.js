testauth.controller('AssessmentSegmentController',['$scope','$state', 'loadedData', 'segmentList', 'SegmentService',
    function($scope, $state, loadedData, segmentList, SegmentService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
        $scope.segmentList = segmentList.data.searchResults;

		if (!$state.current.searchParams) {
            $scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "sortKey":"position", "sortDir":"asc", "currentPage": 1, "pageSize":10};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchSegments = function(params) {
            return SegmentService.search(params);
        };

        $scope.oneUp = function(segment) {
			segment.position--;
			savePositionChange(segment);
        };

        $scope.oneDown = function(segment) {
			segment.position++;
			savePositionChange(segment);
        };

        function savePositionChange(segment) {
			$scope.savingIndicator = true;
  			
			SegmentService.save(segment).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				if ($scope.errors.length == 0) {
					SegmentService.search({"assessmentId": $scope.assessment.id, "pageSize": 10}).then(function(response) {
				        $scope.segmentList = response.data.searchResults;
					});
		            $scope.$broadcast('initiate-segment-search');
				}
			});
        };

        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.segmentId = "";
            $state.transitionTo("assessmenthome.segmentedit", params);
        };

        $scope.view = function(segment) {
            $state.transitionTo("assessmenthome.segmentedit", {assessmentId:$scope.assessment.id, segmentId:segment.id});
        };
        
        $scope.remove = function(segment) {
            if (confirm("Are you sure you want to delete this segment?")) {
    			$scope.deleteIndicator = true;
                SegmentService.remove(segment).then(function(response) {
                    $scope.errors = response.errors;
                    var index = $scope.searchResponse.searchResults.indexOf(segment);
                    $scope.searchResponse.searchResults.splice(index, 1);
					SegmentService.search({"assessmentId": $scope.assessment.id, "pageSize": 10}).then(function(response) {
				        $scope.segmentList = response.data.searchResults;
					});
                    $scope.$broadcast('initiate-segment-search');
        			$scope.deleteIndicator = false;
                });
            };
        };
	}
]);
