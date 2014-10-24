testauth.controller('AssessmentSegmentItemSortController',['$scope','$state', '$filter', 'loadedData','segmentListData','ItemService', '$location', '$anchorScroll', 'ItemGroupService','FormPartitionService',
      function($scope, $state, $filter, loadedData, segmentListData, ItemService, $location, $anchorScroll, ItemGroupService, FormPartitionService) {
  		$scope.errors = loadedData.errors;
  		$scope.assessment = loadedData.data;
  		$scope.searchResponse = {};
  		
		$scope.locationType = "SEGMENT";
	
		$scope.defaultTibParams = {p:{}};
		
		////// form filters
		$scope.segmentList = [];
		
		if(segmentListData.data){
			var adaptiveSegments = $filter('adaptiveSegments')(segmentListData.data.searchResults);
			$scope.segmentList.push({"id":"", "title":"Select Segment"});
        	angular.forEach(adaptiveSegments, function(segment){
        		$scope.segmentList.push({"id": segment.id , "title":  segment.label});
			});
        	$scope.segmentId = "";
        }
		//END FORM FILTERS
		
		$scope.itemGroupMap = {};
		$scope.refreshGroups = function(){
			var params = {
					"assessmentId" : $scope.assessment.id,
					"locationType" : $scope.locationType,
					"locationId" : $scope.segmentId,
					"currentPage":0,
					"pageSize": 1000,
					"sortKey":"groupName"
			};
			ItemGroupService.search(params).then( function(response){
				$scope.itemGroupMap = {};
				$scope.itemGroupMap["NO_GROUP"] = {id:"NO_GROUP", groupName:"NO_GROUP"};
				if(response.data){
					angular.forEach(response.data.searchResults, function(itemGroup){
						$scope.itemGroupMap[itemGroup.id] = itemGroup;
					});
				 }
			 });
		};
		
		$scope.hasItems = function(){
			return $scope.sortedGroupedItems.length > 0;
		};
		
		$scope.readyToSort = function(){
			return true;
		};
		
        $scope.setUpdated = function() {
        	$scope.sortChanged = true;
        };
		
		$scope.segmentChanged = function() {
			$scope.refreshGroups();
			$scope.refreshItems();
			$scope.changed = true;
			if(document.getElementById($scope.selectedCellId) != null) {
  	   			document.getElementById($scope.selectedCellId).setAttribute("tabindex", "0");
			}
		};
		
		
		$scope.isMultiItemGroup = function(group){
			return group.length > 1;
		};
		
		$scope.saveSorting = function(){
			$scope.saving = true;
			var level1Index = 1;
			var locationItemsToSave = [];
			angular.forEach($scope.sortedGroupedItems, function(groupArray){
				var level2Index = 1;	
				angular.forEach(groupArray, function(location){
					location.level2SortIndex = level2Index;
					location.level1SortIndex = level1Index;
					locationItemsToSave.push(location);
  					level2Index++;
  				});
				level1Index++;
			});
			ItemService.updateSegmentSortInfo($scope.segmentId, locationItemsToSave).then(function(response) {
				$scope.saving = false;
				$scope.refreshItems();
			});
		};

		$scope.saving = false;
		$scope.loading = false;
		$scope.sortChanged = false;
		$scope.sortableOptions = {
            disabled: $scope.assessment.locked,
            sort: function(e, ui){ // make placeholder same height as item rows
                ui.placeholder.height(ui.item.height());
            },
            update: function(e, ui) {
                $scope.sortChanged = true;
            },
            placeholder : 'ui-sortable-placeholder'                
		};

  		$scope.refreshItems = function() {
  			$scope.sortedGroupedItems = [];
  			$scope.sortChanged = false;
  			if($scope.assessment.id != null && $scope.segmentId){
	  			var params = {"assessmentId": $scope.assessment.id,
						   "segmentId": $scope.segmentId,
		        		   "sortDir":"desc", "currentPage": 0, "pageSize":"100000"};
	  					$scope.loading = true;
			  			ItemService.search(params).then(function(response) {
			  					if(response.data.searchResults){
			  						$scope.loadSearchableItemList(response.data.searchResults, $scope.segmentId);
			  					};
			    		});
	  			}
  		};
  		
  		$scope.sortedGroupedItems = [];
  		$scope.loadSearchableItemList = function(itemList, segmentId){
  			var locationList = [];
  			angular.forEach(itemList, function(item){
  				angular.forEach(item.itemLocation, function(location){
  					if(location.segmentId == segmentId){
  						locationList.push({itemIdentifier:item.tibIdentifier, segmentId: location.segmentId, itemGroupId : location.itemGroupId, level1SortIndex : location.level1SortIndex, level2SortIndex: location.level2SortIndex, type:location.type});
  					}
  				});
			});
  			var sortedList = $filter('orderBy')(locationList, ["level1SortIndex", "level2SortIndex"], "false");
  			
  			var sortableItems = [];
  			var level1 = null;
  			var groupArray = [];
  			angular.forEach(sortedList, function(location){
  				if(location.level1SortIndex != level1 && groupArray.length > 0){
  					sortableItems.push(groupArray);
  					groupArray = [];
  				}
  				level1 = location.level1SortIndex;
  				groupArray.push(location);
			});
  			sortableItems.push(groupArray);
  			$scope.sortedGroupedItems = sortableItems;
  			$scope.loading = false;
  		};
  		
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.changed) {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
  		
  	}]);
