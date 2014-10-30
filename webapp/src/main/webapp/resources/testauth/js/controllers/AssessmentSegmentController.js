testauth.controller('AssessmentSegmentController',['$scope','$state', 'loadedData', 'segmentList', 'SegmentService',
    function($scope, $state, loadedData, segmentList, SegmentService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
        $scope.segmentList = segmentList.data.searchResults;
        $scope.positionChanged = false;

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
        
        $scope.isSortHidden = function() {
            return $scope.sortableSegmentOptions.length == 1;
        };
        
        $scope.setUpdated = function(event) {
        	// if space bar pressed
        	if(event.keyCode == 32) {
        		$scope.positionChanged = true;
        	}
        };
        
		$scope.sortableSegmentOptions = {
			cursor: $scope.assessment.locked ? "default" : "move",
			disabled: $scope.assessment.locked,
			update: function(e, ui) {
				$scope.positionChanged = true;
			}
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
        
        $scope.savePosition = function() {          
			$scope.updateIndicator = true;
			$scope.segments = [];
        	for (var i = 0; i < $scope.searchResponse.searchResults.length; i++) {
				var segment = $scope.searchResponse.searchResults[i];
				segment.position = i+1;
        		$scope.segments.push(segment);
        	}
        	
            SegmentService.updateCollection($scope.segments).then( function(response) {
                $scope.errors = response.errors;
				$scope.messages = response.messages;
    			$scope.updateIndicator = false;
				if ($scope.errors.length == 0) {
	                $scope.$broadcast('initiate-segment-search');
					$scope.positionChanged = false;
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
  		
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.positionChanged) {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
	}
]);
