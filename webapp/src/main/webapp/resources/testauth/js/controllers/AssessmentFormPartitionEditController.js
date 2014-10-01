testauth.controller('AssessmentFormPartitionEditController',['$scope','$state', 'loadedData', 'loadedFormList', 'loadedFormPartition', 'FormPartitionService', 'SegmentService', 'segmentList', 'focus',
    function($scope, $state, loadedData, loadedFormList, loadedFormPartition, FormPartitionService, SegmentService, segmentList, focus) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
		$scope.editFormPartition = true;
        $scope.formPartition = loadedFormPartition.data;
        
        if (!$scope.formPartition.id) {
        	$scope.formPartition.assessmentId =  $scope.assessment.id;
        }

        $scope.formList = loadedFormList.data.searchResults;
        $scope.segmentList = segmentList.data.searchResults;
        
        $scope.save = function() {
            $scope.savingIndicator = true;
            return FormPartitionService.save($scope.formPartition).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
                $scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.editableForm.$setPristine();
                    $scope.formPartition = response.data;
			        $scope.toggleEditor();
			        $scope.isNew = false;
			        $state.transitionTo("assessmenthome.formhome.partitionedit", {assessmentId:$scope.assessment.id, formId:$scope.formPartition.formId, formPartitionId:$scope.formPartition.id});
                } else {
					angular.forEach($scope.errorsMap, function(msg,key){
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);
					});
					return "Error";
				}
            });
        };

        $scope.hasFieldError = function(fieldName) {
        	var found = false;
        	for (var key in $scope.messages) {
        		if (key.indexOf(fieldName) === 0) {
	    			found = true;
	    			break;
        		};
        	}
	    	return found;
        };
        
        $scope.fieldErrorText = function(fieldName) {
            var messageMap = $scope.messages;
            var fieldMap = messageMap ? messageMap[fieldName] : null;
            return fieldMap ? fieldMap.join('\n') : '';
        };
        
        $scope.edit = function() {
			focus('focusEdit');
            $scope.originalFormPartition = angular.copy($scope.formPartition);
            $scope.editableForm.$show();
        };

        $scope.toggleEditor = function() {
            $scope.editFormPartition = !$scope.editFormPartition;
            $scope.formAction = $scope.editFormPartition ? 'Edit' : 'View';
		};

        $scope.cancel = function() {
			$scope.errors = [];
			$scope.messages = {};
			$scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
            $scope.formPartition = angular.copy($scope.originalFormPartition);
        	$scope.toggleEditor();
        };

        $scope.back = function() {
            $scope.actionButton = 'cancel';
            $state.transitionTo("assessmenthome.formhome.partitionsearch", {assessmentId:$scope.assessment.id});
        };
                
        $scope.returnToSearch = function() {
        	$scope.cancelEditor();
			$state.transitionTo("assessmenthome.formhome.partitionsearch", {assessmentId:$scope.assessment.id});
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });

        $scope.actionButton = '';
        $scope.formAction = 'Add';
        if ($scope.formPartition && $scope.formPartition.id) {
    		$scope.editFormPartition = false;
            $scope.formAction = 'Edit';
            $scope.isNew = false;
        } else {
			focus('focusEdit');
			$scope.isNew = true;
        }
}]);
