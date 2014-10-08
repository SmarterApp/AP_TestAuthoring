testauth.controller('AssessmentMasterPoolItemsController', ['$scope','$state','$filter','loadedData', 'segmentListData', 'formPartitionListData', 'itemGroupListData', 'itemMetadataKeyData', 'affinityGroupListData', 'ItemService', 'AffinityGroupService', '$location', '$anchorScroll', 
      function($scope, $state, $filter, loadedData, segmentListData, formPartitionListData, itemGroupListData, itemMetadataKeyData, affinityGroupListData, ItemService, AffinityGroupService, $location, $anchorScroll) {
		$scope.assessment = loadedData.data;
		$scope.searchParams = {};
		$scope.searchResponse = {};
		$scope.showToolsFocus = false;

		$scope.segmentMap = {};
		angular.forEach(segmentListData.data.searchResults, function(segment) {
			$scope.segmentMap[segment.id] = segment;
		});
		$scope.formPartitionMap = {};
		angular.forEach(formPartitionListData.data.searchResults, function(partition) {
			$scope.formPartitionMap[partition.id] = partition;
		});

		$scope.itemGroupMap = {};
		var NO_GROUP_ID = 'NO_GROUP';
		var NO_GROUP_OBJECT = {id:NO_GROUP_ID, groupName : 'Ungrouped'};
		$scope.itemGroupMap[NO_GROUP_ID] = NO_GROUP_OBJECT;
		$scope.itemGroupMap[null] = NO_GROUP_OBJECT;
		angular.forEach(itemGroupListData.data.searchResults, function(itemGroup) {
			$scope.itemGroupMap[itemGroup.id] = itemGroup;
		});
			
		$scope.affinityGroups = affinityGroupListData.data.searchResults;
		$scope.itemMetadataKeys = itemMetadataKeyData.data.itemMetadataKeys ? itemMetadataKeyData.data.itemMetadataKeys.sort() : [];
		$scope.metadataParams = [];
		
		$scope.addMetadataFilter = function() {
		    $scope.metadataParams.push( { filterName:"", filterValue:"" } );
		};
		
		$scope.removeMetadataFilter = function(index) {
            $scope.metadataParams.splice(index, 1);
		};
		
		$scope.checkFilterErrors = function(params){
			$scope.paramErrors = null;
			var prettyString = "";
			var paramsArrayMap = {};
			angular.forEach(params, function(param,index){
				if(param.filterValue && param.filterValue.trim().length > 0) {
					if(paramsArrayMap[param.filterName]  == null){
						paramsArrayMap[param.filterName] = [];
					}
					if(paramsArrayMap[param.filterName].indexOf(param.filterValue) != -1) {
						//duplicate parameter found
						$scope.paramErrors = "Please remove duplicate search params before searching.";
						prettyString = "Please remove duplicate search params before searching.";
					} else {
						paramsArrayMap[param.filterName].push(param.filterValue);
					}
				}
			});
			return prettyString;
		};
		
        $scope.searchAssessmentItems = function(params) {
            angular.forEach($scope.metadataParams, function(metaFilter) {
                params[metaFilter.filterName] = metaFilter.filterValue;
            });
        	return ItemService.search(params);
        };
        
        $scope.resetSearchParams = function(params) {
            $scope.metadataParams = [];
            return $scope.getDefaultSearchParams(params);  
        };
        
        $scope.getDefaultSearchParams = function(params) {
        	return {"assessmentId": $scope.assessment.id, "pageSize":25};
        };
        
        $scope.validateAffinityGroups = function () {
            $scope.errors = [];
            $scope.warnings = [];
            AffinityGroupService.getValidationResults($scope.assessment.id).then(function(response){                
                angular.forEach(response.data, function(validationResult){
                    if (validationResult.validationLevel == 'warning') {
                        $scope.warnings.push(validationResult.message);
                    } else {
                        $scope.errors.push(validationResult.message);
                    }
                });
            });
        };
        $scope.validateAffinityGroups();
        
        if (!$state.current.searchParams) {
            $scope.searchParams = $scope.getDefaultSearchParams();
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        
        $scope.getLocationNames = function(item) {
            var locationNames = [];
            angular.forEach(item.itemLocation, function(location) {
                if (location.segmentId) {
                    var locationName =  $scope.segmentMap[location.segmentId].label + " - "  + $scope.itemGroupMap[location.itemGroupId].groupName;
                    locationNames.push(locationName);
                }
                if (location.formPartitionId) {
                    var locationName = $scope.formPartitionMap[location.formPartitionId].form.name + " - " + $scope.formPartitionMap[location.formPartitionId].name + " - "  + $scope.itemGroupMap[location.itemGroupId].groupName;
                    locationNames.push(locationName);
                }
            });
            
            return locationNames.join(", ");
        };
        
        $scope.getAffinityGroupLocationNames = function(item) {
            var locationNames = [];
            angular.forEach(item.itemLocation, function(location) {
                if (location.affinityGroupId) {
                    var foundGroups = $.grep($scope.affinityGroups, function(ag) { return ag.id == location.affinityGroupId; });
                    if ( foundGroups.length > 0 ) {
                        locationNames.push(foundGroups[0].groupName);
                    }
                }
            });
            
            return locationNames.join(", ");
        };
		
      //~ assign to affinity group code----------------------------
        $scope.closeEditWidget = function(){
            $scope.showEditWidget = false;
            $scope.showToolsFocus = true;
            $scope.showItemSelectors = false;
        };
        
        $scope.openEditWidget = function(){
            $scope.showEditWidget = true;
            $scope.showToolsFocus = false;
            $scope.showItemSelectors = true;
            $scope.operationComplete = false;
            $scope.itemCheckboxMap = {};
            $scope.widgeterrors = [];
            $scope.targetAffinityGroupId = '';
            $scope.selectedAction = 'attach';
            $scope.bulkEditMessage = "";
        };

        $scope.moveToTop = function() {
        	$location.hash('topOfPage');
	       	$anchorScroll();
        };

        $scope.moveToBottom = function() {
	       	$location.hash('bottomOfTable');
	       	$anchorScroll();
        };

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
        
        $scope.assignItems = function(){
            $scope.widgeterrors = [];
            var items = [];
            
            // find items to attach
            angular.forEach($scope.itemCheckboxMap, function(value, key){
                if(value == true){
                    items.push(key);
                }
            });
                        
            // validate selections
            if(!$scope.targetAffinityGroupId) {
                $scope.widgeterrors.push('Please select an affinity group.');
            } 
            if (items.length == 0) {
                $scope.widgeterrors.push('Please select at least one item.');
            } 
            if ($scope.selectedAction != 'attach' && $scope.selectedAction != 'detach') {
                $scope.widgeterrors.push('Please select a valid action.');
            }
            
            // attach items
            if ($scope.widgeterrors.length == 0 ) {
                if ($scope.selectedAction === 'attach') {
                    AffinityGroupService.attachItemsToAffinityGroup($scope.targetAffinityGroupId, items).then($scope.doneWithBulkChange);
                } else if ($scope.selectedAction === 'detach') {
                    AffinityGroupService.detachItemsFromAffinityGroup($scope.targetAffinityGroupId, items).then($scope.doneWithBulkChange);
                }
            }
        };
        
        $scope.bulkEditMessage = "";
        $scope.doneWithBulkChange = function(response){
            $scope.operationComplete = true;
            $scope.bulkEditMessage = "";
            if(response.errors){
                $scope.widgeterrors = response.errors;
            }
            if(response.data){
                $scope.bulkEditMessage = response.data.itemsImpacted + " successful items, " + response.data.itemsOmitted + " items omitted.";
                if (response.data.message) {
                    $scope.bulkEditMessage += response.data.message;
                }
            }

            $scope.$broadcast('initiate-master-pool-search');
            $scope.validateAffinityGroups();
        };
 }]);
