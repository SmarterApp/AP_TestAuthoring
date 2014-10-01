testauth.controller('AssessmentAffinityGroupItemController', ['$scope', '$filter', '$state', 'loadedData', 'loadedAffinityGroup', 'loadedSegment', 'AffinityGroupService', 'SegmentService', 'ItemService',
    function ($scope, $filter, $state, loadedData, loadedAffinityGroup, loadedSegment, affinityGroupService, segmentService, itemService) {
		$scope.searchResponse = {};
        $scope.errors = loadedData.errors;
        $scope.messages = loadedData.messages;
        $scope.assessment = loadedData.data;
        $scope.affinityGroup = loadedAffinityGroup.data;
        $scope.segment = loadedSegment.data;
        $scope.showTools = true;
        
		if (!$state.current.searchParams) {
			$scope.searchParams = { "assessmentId" : $scope.assessment.id, "sortKey" : "name", "sortDir" : "asc", "currentPage" : 1, "locationType": $scope.locationType, "pageSize":10};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
		
		$scope.searchSegmentItems = function(params) {
			params.affinityGroupId = $scope.affinityGroup.id;
			params.segmentId = $scope.segment.id;
			return itemService.search(params);
		};
		$scope.importItems = function(params) {
			var params = {};
			params.targetAffinityGroupId = $scope.affinityGroup.id;
			params.targetSegmentId = $scope.segment.id;
			affinityGroupService.importItems(params);
		};
		$scope.openItemSearch = function() {
			$scope.toggleTools("agSearch");
		};
		$scope.toggleTools = function(option) {
			$scope.showTools = false;
			
			switch (option) {
			case "tools" :
				$scope.showTools = true;
				break;
			case "agSearch" :
				$scope.showAffinityGroupSearch = true;
				break;
			}
		};
		$scope.closeAffinityGroupSearch = function() {
			
		};
		
}]);