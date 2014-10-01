testauth.controller('SubjectFormController',['$scope','$state', 'loadedData', 'formAction', 'SubjectService', 
    function($scope, $state, loadedData, formAction, SubjectService) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
		$scope.subject = loadedData.data;

		if (formAction == 'View') {
			$scope.subject.inUse = true;
		}
		$scope.actionButton = '';
		$scope.formAction = 'Add';
		if ($scope.subject && $scope.subject.id) {
			$scope.formAction = 'Edit';
			$scope.isNew = false;
			$scope.selectedTenantName = $scope.subject.tenantName;
		} else {
			$scope.isNew = true;
		    $scope.subject.inactive = false;
		}
		
		$scope.inactiveItems = [
            { key: false, label: 'Active' },
            { key: true, label: 'Inactive' }
        ];

		$scope.save = function() {
			$scope.savingIndicator = true;
			return SubjectService.save($scope.subject).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				if ($scope.errors.length == 0) {
					$scope.editableForm.$setPristine();
					$scope.subject = response.data;
					$scope.selectedTenantName = $scope.subject.tenantName;
					$scope.isNew = false;
					$state.transitionTo("subjectForm", { subjectId : $scope.subject.id, formAction: 'Edit'});
				} else {
					angular.forEach($scope.errorsMap, function(msg,key) {
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);
					});
					return "Error";
				}
			});
		};

		$scope.back = function() {
			$scope.actionButton = 'cancel';
			$state.transitionTo("subjectsearch");
		};
		
		$scope.edit = function() {
            $scope.originalSelectedTenantName = angular.copy($scope.selectedTenantName);
            $scope.originalSubject = angular.copy($scope.subject);
		    $scope.editableForm.$show();
		};
		
		$scope.cancel = function() {
			$scope.errors = [];
			$scope.errorsMap = {};
			$scope.messages = {};
		    $scope.selectedTenantName = angular.copy($scope.originalSelectedTenantName);
            $scope.selectedTenantType = null;
            $scope.subject = angular.copy($scope.originalSubject);
            $scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
		};
		
		$scope.resetTenant = function(){
            $scope.subject.tenantId = null;
        };
		
		$scope.changeTenant = function(newTenant) {
            if (newTenant) {
                $scope.subject.tenantId = newTenant.id;
            } else {
                $scope.subject.tenantId = null;
            }
        };

  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    		if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
    			if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
    				event.preventDefault();
    			}
	    	}
  		});
  		
	}]);

