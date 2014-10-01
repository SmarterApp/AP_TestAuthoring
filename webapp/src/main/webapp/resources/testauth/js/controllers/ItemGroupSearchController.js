
testauth.controller('ItemGroupSearchController', [ '$scope', '$state', 'loadedData', 'formPartitionListData', 'segmentListData', 'pageDetails', 'ItemGroupService', 'ItemService', 'FormPartitionService',
	function ItemGroupSearchController($scope, $state, loadedData, formPartitionListData, segmentListData, pageDetails, ItemGroupService, ItemService, FormPartitionService) {
		
		$scope.searchResponse = {};
		$scope.locationType = pageDetails.locationType;
		$scope.assessment = loadedData.data;
		
		if (!$state.current.searchParams) {
			$scope.searchParams = { "assessmentId" : $scope.assessment.id, "sortKey" : "name", "sortDir" : "asc", "currentPage" : 1, "locationType": $scope.locationType, "pageSize":10};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
		
		$scope.onFormsPage = function(){
			return $scope.locationType == 'FORM_PARTITION';
		};
		
		$scope.segmentList = [];
		if(segmentListData.data){
			$scope.segmentList = segmentListData.data.searchResults;
		}
		
		if(formPartitionListData.data){
			$scope.formPartitionList = formPartitionListData.data.searchResults; 
		}
		$scope.setLocation = function(id){
			$scope.searchParams.locationId = id;
		};

		
		$scope.searchItemGroups = function(params) {
			return ItemGroupService.search(params);
		};

		$scope.removeItemGroup = function(itemGroup) {
        	if(confirm("Are you sure you want to delete this Item Group?")) {
        		ItemGroupService.remove(itemGroup).then(function(response) {
                    $scope.errors = response.errors;
                    $scope.$broadcast('initiate-itemGroup-search');
                });
        	}
        };
        
		
		$scope.editGroup = function(itemGroupId){
			var params = {assessmentId:$scope.assessment.id, itemGroupId:itemGroupId};
			if($scope.onFormsPage()){ 
				$state.transitionTo("assessmenthome.formhome.itemgroupForm", params);
			}else{
				$state.transitionTo("assessmenthome.itempool.groupsForm",params);
			}
		};
		
		
		$scope.addNewItemGroup = function(){
			if($scope.onFormsPage()){ 
				$state.transitionTo("assessmenthome.formhome.itemgroupForm", {assessmentId:$scope.assessment.id});
			}else{
				$state.transitionTo("assessmenthome.itempool.groupsForm", {assessmentId:$scope.assessment.id});
			}
		};
		
		$scope.postProcessGroup = function(itemGroup) {
		    var searchParams = {itemGroupId: itemGroup.id};
		    ItemService.search(searchParams).then( function(response) {
		        itemGroup.itemCount = response.data.totalCount;
		    });
        };
		
	}
]);
