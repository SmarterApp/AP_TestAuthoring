testauth.controller('AssessmentFormItemController',['$scope','$state', '$filter', 'loadedData', 'formPartitionListData','ItemService', 'BlueprintElementService', 'CoreStandardsService', '$location', '$anchorScroll', 'ItemGroupService','FormPartitionService',
      function($scope, $state, $filter, loadedData, formPartitionListData, ItemService, BlueprintElementService, CoreStandardsService, $location, $anchorScroll, ItemGroupService, FormPartitionService) {
        $scope.errors = loadedData.errors;
        $scope.warnings = loadedData.warnings;
  		$scope.assessment = loadedData.data;
  		$scope.searchResponse = {};
  		
  		$scope.showTools = true;
  		$scope.showToolsFocus = false;
		$scope.showWidgets = false;
		$scope.showTibSearch = false;
		$scope.deletingAll = false;
        
    	$scope.searchParams =  {"assessmentId": $scope.assessment.id
    							, "formPartitionId" : null
		  						, "sortKey":"itemGroupId"
				        		, "sortDir":"desc", "currentPage": 1
				        		, "pageSize":"25"};
    	
    
		$scope.locationType = "FORM_PARTITION";
		$scope.defaultTibParams = {p:{}};
		
		$scope.validateForms = function () {
            $scope.errors = [];
            $scope.warnings = [];
		    FormPartitionService.getValidationResults($scope.assessment.id).then(function(response){		        
		        angular.forEach(response.data, function(validationResult){
		            if ( validationResult.validationLevel == 'warning') {
		                $scope.warnings.push(validationResult.message);
		            } else {
		                $scope.errors.push(validationResult.message);
		            }
                });
            });
        };
       		
		$scope.hasPartitions = false;
		////// form filters
		$scope.formPartitionMap = {};
		if(formPartitionListData.data != null && formPartitionListData.data.searchResults != null){
        	angular.forEach(formPartitionListData.data.searchResults, function(formPartition){
				$scope.formPartitionMap[formPartition.id] = formPartition;
			});
        	if(formPartitionListData.data.searchResults.length > 0 ){
        		$scope.hasPartitions = true;
        		$scope.searchParams.formPartitionId = formPartitionListData.data.searchResults[0].id;        		
        	}
        }
		
		$scope.formPartitionChanged = function(){
			$scope.refreshItemGroups();
		};
		
		var NO_GROUP_ID = 'NO_GROUP';
		var NO_GROUP_OBJECT = {id:NO_GROUP_ID, groupName : 'Ungrouped'};
		$scope.itemGroupMap = {NO_GROUP_ID: NO_GROUP_OBJECT};
		
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
		
		$scope.refreshItemGroups = function(){
		    $scope.validateForms();
			if($scope.searchParams.formPartitionId){
				ItemGroupService.search({"locationType":"FORM_PARTITION", "locationId": $scope.searchParams.formPartitionId, "pageSize": 1000, "sortKey":"groupName"}).then( function(response){
					if(response.data){
						 $scope.refreshItemGroupMap(response.data.searchResults); 
					 }
				 });
			}
		};
		$scope.refreshItemGroups();
		//END FORM FILTERS	
        
        $scope.searchItems = function(params) {
        	$scope.openTools();
        	return ItemService.search(params);
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
		//tib search widet
		$scope.openTibSearch = function(params) {
			$scope.toggleTools("tibSearch");
			if(!params){
				$scope.defaultTibParams = $scope.defaultTibSearchParams();
			}else{
				$scope.defaultTibParams = params;
			}
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

		$scope.tibSearchClosed = function(options){
			$scope.openTools();
			$scope.refreshItemGroups();
		};
		
		$scope.openTools = function(){
			$scope.toggleTools("tools");
		};
		
        $scope.focusTools = function() {
        	$scope.openTools();
        	$scope.showToolsFocus = true;
        };
		//end tib search widget
		
		// edit widget
		$scope.closeEditBar = function(){
			$scope.focusTools();
			$scope.showItemSelectors = false;
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

        CoreStandardsService.searchGradeByPublication({"publicationKey":$scope.assessment.publication.coreStandardsPublicationKey}).then( function(response) {
            $scope.grades = response.data.payload;
        });

        $scope.gradesSelector = {
            'placeholder': "Select...",
            'allowClear': true,
            'multiple': true,
            'simple_tags': true,
            'width' :'resolve',
            'query': function (query) {
                var data = { results: $scope.convertGradesToSelect2Array($scope.grades) };
                query.callback(data);
            },
            'id': function(select2Object) { // retrieve a unique id from a select2 object
                return select2Object.id;
            }
        };
		
        $scope.convertGradesToSelect2Array = function(grades) {
            return $.map( grades, function(grade) { return { "id":grade.key, "text":grade.name }; });
        };

        function hasSearchParam(paramName){
    		return $scope.searchParams[paramName] !=null && $scope.searchParams[paramName].length > 0;
    	};
    	
    	$scope.isMoveOrDeleteAllowed = function(){
    		return hasSearchParam('formPartitionId') && hasSearchParam('itemGroupId') && !$scope.operationComplete;
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
	    		if(value.formPartitionId == $scope.searchParams.formPartitionId && value.itemGroupId == $scope.searchParams.itemGroupId){
						locationName = $scope.formPartitionMap[value.formPartitionId].form.name + " - " + $scope.formPartitionMap[value.formPartitionId].name + " - "  + $scope.itemGroupMap[value.itemGroupId].groupName;
	    		}
			});
    		return locationName;
    	};
    	
    	$scope.moveItemGroupList = [];
    	$scope.refreshMoveGroups = function(partitionId){
    		$scope.moveItemGroupList = []; 
    		if(partitionId){
				ItemGroupService.search({"locationType":"FORM_PARTITION", "locationId":partitionId, "pageSize": 1000, "sortKey":"groupName"}).then( function(response){
					if(response.data){
						$scope.moveItemGroupList.push(NO_GROUP_OBJECT); 
						$scope.moveItemGroupList = $scope.moveItemGroupList.concat(response.data.searchResults);
					 }
					 $scope.moveTargetGroupId = NO_GROUP_ID;
				});
			}
		};
		$scope.moveTargetPartitionId = null;
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
			if($scope.moveTargetPartitionId != null && $scope.moveTargetGroupId != null){
				var items = [];
				angular.forEach($scope.itemCheckboxMap, function(value, key){
					if(value == true){
						items.push(key);
					}
				});
				var moveRequest = {
						"targetLocationId": $scope.moveTargetPartitionId,
						"targetGroupId" :  $scope.moveTargetGroupId,
						"sourceLocationId": $scope.searchParams.formPartitionId,
						"sourceGroupId" :  $scope.searchParams.itemGroupId,
						"itemMetadataIds" : items
				};
				ItemService.moveInForm($scope.assessment.id, moveRequest).then($scope.doneWithBulkChange);
			}else{
				$scope.widgeterrors = ['Please enter a target form partition and target group to move items'];
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
				var deleteRequest = {
						"sourceLocationId": $scope.searchParams.formPartitionId,
						"sourceGroupId" :  $scope.searchParams.itemGroupId,
						"itemMetadataIds" : items
				};
				ItemService.removeFromForm($scope.assessment.id, deleteRequest).then($scope.doneWithBulkChange);
			}else{
				$scope.widgeterrors = ['Please select items to delete.'];
			}
		};
		
		$scope.deleteAllPartitionItems = function() {
			var formPartition = $scope.formPartitionMap[$scope.searchParams.formPartitionId];
			if (confirm("Are you sure you want to delete all items for the " + formPartition.form.name + " - " + formPartition.name  + " form partition?")) {
				$scope.deletingAll = true;
				ItemService.removeByFormPartitionId($scope.searchParams.formPartitionId).then(
					function(response) {
						$scope.errors = response.errors;
						$scope.closeEditBar();
						$scope.$broadcast('initiate-itempool-search');
						$scope.validateItemPools();
						$scope.deletingAll = false;
					});
			}
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
				$scope.validateForms();
			}
		};
    	//edit edit widget
 
        $scope.toggleTools = function(option) {
			$scope.showTools = false;
			$scope.showToolsFocus = false;
			$scope.showTibSearch = false;
			$scope.showEditWidget = false;
			
			switch(option) {
			case "tools":
				$scope.showTools = true;
				break;
			case "edit":
				$scope.showEditWidget = true;
				break;
			case "tibSearch":
				$scope.showTibSearch = true;
				break;
			}
        };
        
        $scope.getLocation = function(item){
    		var location = {};
    		angular.forEach(item.itemLocation, function(value, key){
	    		if(value.formPartitionId == $scope.searchParams.formPartitionId && value.itemGroupId == $scope.searchParams.itemGroupId){
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
				});
			}
    	};
    	
  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    		if ($scope.tableform.$visible) {
    			if(!confirm("You have unsaved changes. Are you sure you want to leave this page?")){
    				event.preventDefault();
    			}
	    	}
  		});
        
  	}]);
