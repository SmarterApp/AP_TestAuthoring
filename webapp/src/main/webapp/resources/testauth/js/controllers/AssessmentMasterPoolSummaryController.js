testauth.controller('AssessmentMasterPoolSummaryController',['$scope','$state','$filter','loadedData', 'loadedSegments', 'AffinityGroupService', 'AssessmentService',
      function($scope, $state, $filter, loadedData, loadedSegments, AffinityGroupService, AssessmentService) {
        $scope.searchResponse = {};
  		$scope.errors = loadedData.errors;
  		$scope.assessment = loadedData.data;
        $scope.segmentList = loadedSegments.data.searchResults ? loadedSegments.data.searchResults : [];
        $scope.selectedSegmentId = "";
        $scope.itemCountsMap = {};
        
        // initial search
		if (!$state.current.searchParams) {
		    $scope.searchParams = { "assessmentId":$scope.assessment.id, "active":true, "sortKey":"groupName", "sortDir":"asc", "pageSize":25 };
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
		$scope.$broadcast('initiate-affinity-group-search');    
        
		
        $scope.searchAffinityGroups = function(params) {
        	return AffinityGroupService.search(params);
        };
                
        // get actual item counts
        AssessmentService.getAffinityGroupItemCounts($scope.assessment.id).then(function(response) {
            // key = affinityGroupId
            // statsMap = Map<String,Long> ... fieldName -> itemCount
            angular.forEach(response.data, function(statsMap, key) {
                if(!$scope.itemCountsMap[key]) {
                    $scope.itemCountsMap[key] = {};
                }           
                $scope.itemCountsMap[key]["opCount"] = statsMap.opCount;
                $scope.itemCountsMap[key]["ftCount"] = statsMap.ftCount;
                $scope.itemCountsMap[key]["totalCount"] = statsMap.opCount + statsMap.ftCount;                       
            });
        });
        	
        // helper functions
        $scope.getAffinityGroupValue = function(affinityGroup, segmentId) {
            return segmentId ? affinityGroup.affinityGroupValueMap[segmentId] : affinityGroup.masterAffinityGroupValue;
        };
 }]);
