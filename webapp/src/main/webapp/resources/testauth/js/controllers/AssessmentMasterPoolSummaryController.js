testauth.controller('AssessmentMasterPoolSummaryController',['$scope','$state','$filter','loadedData', 'loadedSegments', 'AffinityGroupService', 'AssessmentService',
      function($scope, $state, $filter, loadedData, loadedSegments, AffinityGroupService, AssessmentService) {
        var masterKey = '';
        $scope.searchResponse = {};
  		$scope.errors = loadedData.errors;
  		$scope.assessment = loadedData.data;
        $scope.segmentList = loadedSegments.data.searchResults ? loadedSegments.data.searchResults : [];
        $scope.selectedSegmentId = masterKey;
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
            $scope.itemCountsMap = response.data;

            angular.forEach(response.data, function(affinityGroupMap,affinityGroupId) {
                angular.forEach(affinityGroupMap, function(segmentMap,segmentId) {
                    if(!$scope.itemCountsMap[affinityGroupId][masterKey]) {
                        $scope.itemCountsMap[affinityGroupId][masterKey] = { opCount:0, ftCount:0 };
                    } 
                    $scope.itemCountsMap[affinityGroupId][masterKey]["opCount"] = $scope.itemCountsMap[affinityGroupId][masterKey]["opCount"] + segmentMap.opCount;
                    $scope.itemCountsMap[affinityGroupId][masterKey]["ftCount"] = $scope.itemCountsMap[affinityGroupId][masterKey]["ftCount"] + segmentMap.ftCount;
                });
            });
        });
        	
        // helper functions
        $scope.getAffinityGroupValue = function(affinityGroup, segmentId) {
            return segmentId ? affinityGroup.affinityGroupValueMap[segmentId] : affinityGroup.masterAffinityGroupValue;
        };
 }]);
