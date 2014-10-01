testauth.controller('AssessmentItemSummaryController',['$scope','$state','$filter','loadedData', 'segmentListData', 'BlueprintElementService', 'ItemService',
      function($scope, $state, $filter, loadedData, segmentListData, BlueprintElementService, ItemService) {
  		$scope.savingIndicator = false;
  		$scope.errors = loadedData.errors;
  		$scope.assessment = loadedData.data;
  		$scope.searchResponse = {};
		$scope.segmentList = [];
		$scope.itemStatsMap = {};
		$scope.searchParams = {};
		 
        $scope.getDefaultSearchParams = function() {
            return {"assessmentId": $scope.assessment.id
            		, "sortKey":"grade,standardKey"
            		, "sortDir":"asc", "currentPage": 1
            		, "pageSize":"25", "active":true
            		, "selectedBlueprint":$scope.segmentId, "grade":"", standardKey:""};
        };
        
		//get list of segments
		if(segmentListData.data != null && segmentListData.data.searchResults != null  && segmentListData.data.searchResults.length > 0){
			$scope.segmentList = $filter('adaptiveSegments')(segmentListData.data.searchResults);
		};
		
        if (!$scope.assessment.locked) {
	        $scope.searchParams.currentPage = 1;
	        $scope.$broadcast('initiate-blueprint-search');    
        }    
        $scope.getItemStats = function(segmentId) {
        	$scope.searchParams.searching = true;
        	$scope.itemStatsMap = {};
        	ItemService.getSegmentItemCounts(segmentId).then(function(response) {
        	    $scope.itemStatsMap = response.data;
        	});
        	$scope.searchParams.searching = false;
        };
        
        //~ START row expand/collapse logic ================================================
        $scope.collapsedElements = [];
        
        var getCollapsedIndex = function(parentElement) {
            return $scope.collapsedElements.map(function(e) { return e.id; }).indexOf(parentElement.id);
        };
        
        $scope.collapse = function(parentElement) {
            $scope.collapsedElements.push({
                "id":parentElement.id,
                "standardKey":parentElement.standardKey,
                "grade":parentElement.grade
            });
        };
                
        $scope.expand = function(parentElement) {
            var pos = getCollapsedIndex(parentElement);
            if ( pos > -1 ) {
                $scope.collapsedElements.splice(pos,1);
            }
        };
        
        $scope.isCollapsed = function(blueprintElement) {
            return getCollapsedIndex(blueprintElement) > -1;
        };
        
        // whether a given row has been hidden (equivalent to whether their parent is collapsed)
        $scope.isParentCollapsed = function(blueprintElement) { 
            return $.grep($scope.collapsedElements, function(collapsedElement) {
                var keyMatches = blueprintElement.standardKey.indexOf(collapsedElement.standardKey + "|") == 0;
                return keyMatches && angular.equals(blueprintElement.grade,collapsedElement.grade);
            }).length > 0;
        };
        
        // whether the current row has a child (equivalent to whether the next row in the table is exactly one level down)
        $scope.hasChild = function(rowIndex) {
            var currentElement = $scope.searchResponse.searchResults[rowIndex];
            var nextElement = $scope.searchResponse.searchResults[rowIndex + 1];
            return nextElement ? angular.equals(parseInt(currentElement.level) + 1,parseInt(nextElement.level)) : false;
        };
        
        $scope.hasParent = function(rowIndex) {
            var currentElement = $scope.searchResponse.searchResults[rowIndex];
            return parseInt(currentElement.level) > 1;
        };
        //~ END row expand/collapse logic ================================================
        
        
        $scope.searchBlueprintElements = function(params) {
        	$scope.searchParams.searching = true;
        	return BlueprintElementService.search(params);
        	$scope.searchParams.searching = false;
        };
        
        if($scope.segmentList.length > 0){
			$scope.segmentId = $scope.segmentList[0].id;
			$scope.getItemStats($scope.segmentId);
			
	        if (!$state.current.searchParams) {
	            $scope.searchParams = $scope.getDefaultSearchParams();
	        } else {
	            $scope.searchParams = $state.current.searchParams;
	        }
		}
	
 }]);
