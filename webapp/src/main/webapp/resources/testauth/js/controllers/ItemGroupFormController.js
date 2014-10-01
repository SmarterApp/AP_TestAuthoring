testauth.controller('ItemGroupFormController',['$scope','$filter','$state', '$stateParams','pageDetails', 'loadedData', 'formPartitionListData', 'segmentListData', 'loadedItemGroup', 'ItemGroupService', 'FormPartitionService',
    function($scope,$filter,$state, $stateParams, pageDetails, loadedData, formPartitionListData, segmentListData, loadedItemGroup, ItemGroupService, FormPartitionService) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
        $scope.itemGroup = loadedItemGroup.data;
        $scope.itemGroup.assessmentId = $scope.assessment.id;
        
		$scope.actionButton = '';
        $scope.startInEditMode = false;
        $scope.segmentListMap = {};
        
        $scope.locationType = pageDetails.locationType;
		$scope.formPartitionMap = {};
		
        if($scope.itemGroup && $scope.itemGroup.id){
			$scope.isNew = false;
		}else{
			$scope.isNew = true;
			$scope.itemGroup.locationType = $scope.locationType;
		}

    	$scope.onFormsPage = function(){
			return $scope.locationType == 'FORM_PARTITION';
		};
        
        if(segmentListData.data){
        	var filteredSegments = $filter('adaptiveSegments')(segmentListData.data.searchResults);
        	angular.forEach(filteredSegments, function(segment){
				$scope.segmentListMap[segment.id] = segment;
			});
        }
        
        if(formPartitionListData.data){
        	angular.forEach(formPartitionListData.data.searchResults, function(formPartition){
				$scope.formPartitionMap[formPartition.id] = formPartition;
			});
        }
        
        $scope.refreshFormPartitions = function(){
        	var formId = $scope.editableForm.formId.$modelValue;
			if(formId){
				$scope.formPartitionMap = {};
				FormPartitionService.search({"formId":formId, "pageSize": 1000, "sortKey":"name"}).then( function(response){
					 if(response.data){
						 angular.forEach(response.data.searchResults, function(formPartition){
								$scope.formPartitionMap[formPartition.id] = formPartition;
						  });
					 }
				 });
			}
		};
		
		$scope.save = function(){
			$scope.savingIndicator = true;
			return ItemGroupService.save($scope.itemGroup).then(function(response){
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				if($scope.errors.length == 0){
					$scope.editableForm.$setPristine();
					$scope.itemGroup = response.data;
					$scope.isNew = false;
					if($scope.locationType == 'SEGMENT' ){
						$state.transitionTo("assessmenthome.itempool.groupsForm", {assessmentId:$scope.assessment.id, itemGroupId:$scope.itemGroup.id});
					}else{
						$state.transitionTo("assessmenthome.formhome.itemgroupForm",{assessmentId:$scope.assessment.id, itemGroupId:$scope.itemGroup.id});
					}
					return true;
				}else{
					angular.forEach($scope.errorsMap, function(msg,key){
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);	
					});
					return "Error";
				}
			});
		};
		
		$scope.back = function() {
			if($scope.locationType == 'SEGMENT' ){
				$state.transitionTo("assessmenthome.itempool.groups", {assessmentId:$scope.assessment.id});
			}else{
				$state.transitionTo("assessmenthome.formhome.itemgroups", {assessmentId:$scope.assessment.id});
			}
		};
		
		$scope.edit = function() {
            $scope.originalItemGroup = angular.copy($scope.itemGroup);
            $scope.editableForm.$show();
        };
        
        $scope.cancel = function() {
            $scope.itemGroup = angular.copy($scope.originalItemGroup);
            $scope.editableForm.$setPristine();
		    $scope.editableForm.$cancel();
		    $scope.errors = [];
        };
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
     
	}]);

