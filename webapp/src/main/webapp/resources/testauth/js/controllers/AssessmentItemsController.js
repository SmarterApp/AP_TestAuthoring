testauth.controller('AssessmentItemsController',['$scope','$state','$filter', 'loadedData', 'segmentListData','ItemService', 'BlueprintElementService', '$location', '$anchorScroll', 'ItemGroupService',
      function($scope, $state, $filter, loadedData, segmentListData,  ItemService, BlueprintElementService, $location, $anchorScroll, ItemGroupService) {
  		$scope.savingIndicator = false;
  		$scope.errors = loadedData.errors;
  		$scope.assessment = loadedData.data;
  		$scope.searchResponse = {};
  		
  		$scope.syncIndicator = true;
  		$scope.showTools = true;
  		$scope.showToolsFocus = false;
  		$scope.showStandardSearch = false;
		$scope.showWidgets = false;
		$scope.showConfirmation = false;
		$scope.showMoveDeleteButton = true;
		$scope.showTibSearch = false;
		$scope.segmentList = [];
		$scope.deletingAll = false;
		
		$scope.locationType = "SEGMENT";
		$scope.defaultTibParams = [];
		
		$scope.segmentMap = {};
		$scope.itemGroupMap = {};
		
		var NO_GROUP_ID = 'NO_GROUP';
		var NO_GROUP_OBJECT = {id:NO_GROUP_ID, groupName : 'Ungrouped'};
		$scope.itemGroupMap = {NO_GROUP_ID: NO_GROUP_OBJECT};
        $scope.validateItemPools = function () {
            $scope.errors = [];
            ItemService.getValidationResults($scope.assessment.id).then(function(response){                
                angular.forEach(response.data, function(validationResult){
                    $scope.errors.push(validationResult.message);
                });
            });
        };
        
		$scope.refreshItemGroupMap = function(itemGroups){
			var currentSelection = $scope.searchParams.itemGroupId;
			$scope.itemGroupMap = {};
			$scope.itemGroupMap[NO_GROUP_ID] = NO_GROUP_OBJECT;
			if(itemGroups){
				angular.forEach(itemGroups, function(itemGroup){
					$scope.itemGroupMap[itemGroup.id] = itemGroup;
				});
				if(!$scope.itemGroupMap[currentSelection]){
					$scope.searchParams.itemGroupId = NO_GROUP_ID;
				}
			}
			$scope.$broadcast('initiate-itempool-search');
		};
		
		
		$scope.defaultTibSearchParams = function(){
			var params = [];
			if($scope.assessment){
				var asmt = $scope.assessment;
				params.push({"StandardPublication.Publication":asmt.publication.coreStandardsPublicationKey});
				for (var i = 0; i < asmt.grade.length; i++) { //grade is an array
					params.push({"IntendedGrade":asmt.grade[i]});
				}
			}
			return params;
		};
		
		if(segmentListData.data != null && segmentListData.data.searchResults != null  && segmentListData.data.searchResults.length > 0){
			$scope.segmentList = $filter('adaptiveSegments')(segmentListData.data.searchResults);
			angular.forEach($scope.segmentList, function(segment){
				$scope.segmentMap[segment.id] = segment;
				if(!$scope.currentSegmentLabel) {
					$scope.currentSegmentLabel = segment.label;
				}
			});
		};
		
		$scope.manageItemGroups = function(){
			$state.transitionTo("assessmenthome.itempool.groups", {assessmentId:$scope.assessment.id});
		};
		
		$scope.segmentChanged = function(){
			$scope.currentSegmentLabel = $scope.segmentMap[$scope.searchParams.segmentId].label;
			$scope.refreshItemGroups();
		};
		
		$scope.refreshItemGroups = function(){
		    $scope.validateItemPools();
			if($scope.searchParams.segmentId){
				ItemGroupService.search({"locationType":"SEGMENT", "locationId": $scope.searchParams.segmentId, "pageSize": 1000, "sortKey":"groupName"}).then( function(response){
					 if(response.data){
						 $scope.refreshItemGroupMap(response.data.searchResults); 
					 }
				 });
			}
		};
		
  		$scope.getItemSearchParams = function() {
  			var params = {"assessmentId": $scope.assessment.id
  						, "sortKey":"itemGroupId"
		        		, "sortDir":"desc", "currentPage": 1
		        		, "pageSize":"25"};
  						var filteredSegments = $filter('adaptiveSegments')($scope.segmentList);
  						if(filteredSegments != null && filteredSegments.length > 0){
			  				params.segmentId = filteredSegments[0].id;
			  			}
  			return params;
  		};
  		
        
        if (!$state.current.searchParams) {
        	$scope.searchParams = $scope.getItemSearchParams();
        	$scope.refreshItemGroups();
	     } else {
	    	$scope.searchParams = $state.current.searchParams;
	    	$scope.refreshItemGroups();
	     }
        
        $scope.getItemCounts = function() {
            $scope.missingItemList = null;
	        ItemService.getSegmentItemCounts($scope.searchParams.segmentId).then(function(response) {
	        	$scope.syncIndicator = true;
                angular.forEach(response.data, function(gradeCountMap, blueprintStandard) {
                    angular.forEach(gradeCountMap, function(countMap, blueprintGrade) {
    	        		if(countMap.opCount < countMap.opMax || countMap.ftCount < countMap.ftMax) {
    	        		    var missingItemMap = { 'standard':blueprintStandard, 'grade':blueprintGrade, 'opItems':0, 'ftItems':0 };
    	        		    if (countMap.opCount < countMap.opMax) {
                                missingItemMap.opItems = countMap.opMax - countMap.opCount;
                            }
    	        		    if (countMap.opCount < countMap.opMax) {
                                missingItemMap.ftItems = countMap.ftMax - countMap.ftCount;
                            }
    	        		    
    	        		    if ($scope.missingItemList == null) {
                                $scope.missingItemList = [];
                            }
    	        		    $scope.missingItemList.push(missingItemMap);
    	        		}
                    });
	        	});
	        	$scope.syncIndicator = false;
	        });
        };
        
        $scope.searchItems = function(params) {
        	$scope.openTools();
        	var search;
        	if(params.segmentId){
        		search = ItemService.search(params);
        	}else{
        		search = ItemService.emptyPromise();
        	}
        	return search;
        };
        
        $scope.moveToTop = function() {
        	$location.hash('topOfPage');
	       	$anchorScroll();
        };

        $scope.moveToBottom = function() {
	       	$location.hash('bottomOfTable');
	       	$anchorScroll();
        };
        
		$scope.openTools = function(){
			$scope.toggleTools("tools");
		};
		
        $scope.focusTools = function() {
        	$scope.openTools();
        	$scope.showToolsFocus = true;
        };
        
		$scope.openStandardSearch = function() {
			$scope.toggleTools("standardSearch");
		};
		
		$scope.searchWithStandardsKeys =  function(standardObj,gradeObj){
			var params =  [];
            params.push( {"StandardPublication.PrimaryStandard":standardObj} );
            params.push( {"IntendedGrade":gradeObj} );
			$scope.openTibSearch(params);
		};
		
		$scope.openTibSearch = function(params) {
			$scope.toggleTools("tibSearch");
			if(!params){
				$scope.defaultTibParams = $scope.defaultTibSearchParams();
			}else{
				$scope.defaultTibParams = params;
			}
		};
		
		$scope.toggleMissingStats = function(){
			$scope.getItemCounts();
			$scope.toggleTools("stats");
		};
		
		$scope.tibSearchClosed = function(options){
			$scope.openTools();
			$scope.refreshItemGroups();
		};
        
        
        $scope.toggleTools = function(option) {
			$scope.showTools = false;
			$scope.showToolsFocus = false;
			$scope.showStandardSearch = false;
			$scope.showTibSearch = false;
			$scope.showStats = false;
			$scope.showItemMove = false;
			$scope.showGroupMove = false;
			$scope.showEditWidget = false;
			
			switch(option) {
			case "edit" :
				$scope.showEditWidget = true;
				break;
			case "tools":
				$scope.showTools = true;
				break;
			case "standardSearch":
				$scope.showStandardSearch = true;
				break;
			case "tibSearch":
				$scope.showTibSearch = true;
				break;
			case "stats":
				$scope.showStats = true;
				break;
			}
        };
        
    	// edit widget
		$scope.closeEditBar = function(){
			$scope.showItemSelectors = false;
			$scope.showToolsFocus = true;
			$scope.focusTools();
		};
		
		$scope.openEditWidget = function(){
			$scope.toggleTools('edit');
    		$scope.showItemSelectors = true;
    		$scope.operationComplete = false;
    		$scope.itemCheckboxMap = {};
    		$scope.bulkEditMessage = "";
    	};
    	
    	$scope.moveOrDelete = "Move";
    	$scope.openMoveItemWindow = function(){
			$scope.moveOrDelete = "Move";
			$scope.openEditWidget();
		};
		
		$scope.openDeleteItemWindow = function(){
			$scope.moveOrDelete = "Delete";
			$scope.openEditWidget();
		};
		
    	function hasSearchParam(paramName){
    		return $scope.searchParams[paramName] !=null && $scope.searchParams[paramName].length > 0;
    	};
    	
    	$scope.isMoveOrDeleteAllowed = function(){
    		return hasSearchParam('segmentId') && hasSearchParam('itemGroupId') && !$scope.operationComplete;
    	};
    	
    	$scope.changeEditOption = function(value){
    		$scope.moveOrDelete = value;
    	};
    	
    	$scope.isMoveAllowed = function(){
    		return ($scope.isMoveOrDeleteAllowed() && $scope.moveOrDelete === "Move");
    	};
    	
    	$scope.isDeleteAllowed = function(){
    		return ($scope.isMoveOrDeleteAllowed() && $scope.moveOrDelete === "Delete");
    	};
    	
    	$scope.getLocationName = function(item){
    		var locationName = "unknown";
    		angular.forEach(item.itemLocation, function(value, key){
	    		if(value.segmentId == $scope.searchParams.segmentId && value.itemGroupId == $scope.searchParams.itemGroupId){
						locationName =  $scope.segmentMap[value.segmentId].label + " - "  + $scope.itemGroupMap[value.itemGroupId].groupName;
	    		}
			});
    		return locationName;
    	};
    	
    	$scope.getLocation = function(item){
    		var location = {};
    		angular.forEach(item.itemLocation, function(value, key){
	    		if(value.segmentId == $scope.searchParams.segmentId && value.itemGroupId == $scope.searchParams.itemGroupId){
	    			location =  value;
	    		}
			});
    		return location;
    	};
    	
    	$scope.details = true;
    	$scope.viewDetails = function(){
    		$scope.details = true;
    	};
    	
    	$scope.viewAttributes = function(){
    		$scope.details = false;
    	};
    	
    	$scope.openEditor =  function(tableform){
    		tableform.$show();
    		$scope.viewAttributes();
    		$scope.disableSearch();
    		$scope.editorOpen = true;
    		$scope.showToolsFocus = false;
    	};
    	
    	$scope.cancelEditor =  function(){
    		$scope.disabledSearch = false;
    		$scope.editorOpen = false;
    		$scope.focusTools();
    	};
    	
        $scope.disableSearch = function() {
        	$scope.disabledSearch = true;
        };
        
        $scope.itemErrors = [];
    	$scope.saveAll = function(items){
    		if(items){
    			$scope.saveIndicator = true;
    			$scope.itemErrors = [];
				return ItemService.updateCollection(items).then(function(response) {
					if (response.errors && response.errors.length > 0) {
				    	angular.forEach(response.errors, function(error){
		                    $scope.itemErrors.push(error);
		                });
	                    $scope.saveIndicator = false;
	                    $scope.moveToTop();
	                    return "error"; // return string to cause in-line editor to remain open
				    } else {
				        $scope.saveIndicator = false;
	                    $scope.cancelEditor();
				    }
					$scope.validateItemPools();
				});
			}
    	};
    	
    	$scope.moveItemGroupList = [];
    	$scope.refreshMoveGroups = function(segmentId){
    		$scope.moveItemGroupList = []; 
    		if(segmentId){
				ItemGroupService.search({"locationType":"SEGMENT", "locationId":segmentId, "pageSize": 1000, "sortKey":"groupName"}).then( function(response){
					if(response.data){
						$scope.moveItemGroupList.push(NO_GROUP_OBJECT); 
						$scope.moveItemGroupList = $scope.moveItemGroupList.concat(response.data.searchResults);
					 }
					 $scope.moveTargetGroupId = NO_GROUP_ID;
				});
			}
		};
		$scope.moveSegmentId = null;
		$scope.moveTargetGroupId = null;
		
		$scope.getSelectedItems = function() {
			var selectedItemString = "";
			angular.forEach($scope.itemCheckboxMap, function(value, key){
				if(value == true){
					selectedItemString += key + ", ";
				}
			});
			if(selectedItemString.length > 0){
				selectedItemString = selectedItemString.substring(0, selectedItemString.length-2);
			}else{
				selectedItemString = "None selected";
			}
			return selectedItemString;
		};
		
		$scope.checkAll = function() {
			angular.forEach($scope.searchResponse.searchResults, function(value, key){
				$scope.itemCheckboxMap[value.tibIdentifier] = true;
			});
		};
		
		$scope.uncheckAll = function() {
			$scope.itemCheckboxMap = {};
		};
		
		$scope.moveItems = function(){
			if($scope.moveTargetSegmentId != null && $scope.moveTargetGroupId != null){
				$scope.showMoveDeleteButton = false;
				var items = [];
				angular.forEach($scope.itemCheckboxMap, function(value, key){
					if(value == true){
						items.push(key);
					}
				});
				var moveRequest = {
						"targetLocationId": $scope.moveTargetSegmentId,
						"targetGroupId" :  $scope.moveTargetGroupId,
						"sourceLocationId": $scope.searchParams.segmentId,
						"sourceGroupId" :  $scope.searchParams.itemGroupId,
						"itemMetadataIds" : items
				};
				ItemService.moveInSegmentPool($scope.assessment.id, moveRequest).then($scope.doneWithBulkChange);
			}else{
				$scope.widgeterrors = ['Please enter a target segment and target group to move items'];
			}
		};
		
		$scope.deleteItems = function() {
			var items = [];
			angular.forEach($scope.itemCheckboxMap, function(value, key){
				if(value == true){
					items.push(key);
				}
			});
			if(items.length > 0){
				$scope.showMoveDeleteButton = false;
				var deleteRequest = {
						"sourceLocationId": $scope.searchParams.segmentId,
						"sourceGroupId" :  $scope.searchParams.itemGroupId,
						"itemMetadataIds" : items
				};
				ItemService.removeFromSegmentPool($scope.assessment.id, deleteRequest).then($scope.doneWithBulkChange);
			}else{
				$scope.widgeterrors = ['Please select items to delete.'];
			}
		};
		
		$scope.deleteAllSegmentItems = function() {
			if (confirm("Are you sure you want to delete all items for the " + $scope.currentSegmentLabel + " segment?")) {
				$scope.deletingAll = true;
				ItemService.removeBySegmentId($scope.searchParams.segmentId).then(
					function(response) {
						$scope.errors = response.errors;
						$scope.closeEditBar();
						$scope.$broadcast('initiate-itempool-search');
						$scope.validateItemPools();
						$scope.deletingAll = false;
					});
			}
		};

		$scope.moveDeleteControlsNotAllowed = function() {
			selectedItemCount = [];
			for (key in $scope.itemCheckboxMap) {
				if ($scope.itemCheckboxMap[key] == true) {
					selectedItemCount.push($scope.itemCheckboxMap[key]);
					break;
				}
			}
			return selectedItemCount.length == 0;
		};
		
		$scope.bulkEditMessage = "";
		$scope.doneWithBulkChange = function(response){
			$scope.operationComplete = true;
			$scope.bulkEditMessage = "";
			if(response.errors){
				$scope.widgeterrors = response.errors;
			}
			if(response.data != null && response.data.itemsOmitted > 0){
				$scope.bulkEditMessage = response.data.itemsImpacted + " successful items, " + response.data.itemsOmitted + " items omitted.";
			}
			if(response.data != null &&  response.data.message != null){
				$scope.bulkEditMessage += response.data.message;
			}
			if($scope.bulkEditMessage.length == 0){
				$scope.closeEditBar();
				$scope.$broadcast('initiate-itempool-search');
				$scope.validateItemPools();
			}
			$scope.showMoveDeleteButton = true;
		};
    	//edit edit widget
		
  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    		if ($scope.tableform.$visible) {
    			if(!confirm("You have unsaved changes. Are you sure you want to leave this page?")){
    				event.preventDefault();
    			}
	    	}
  		});
        
  	}]);
