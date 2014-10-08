
testauth.controller('AssessmentPublishingController', ['$scope', '$state', 'loadedData', 'loadedPublishingValidity', 'PublishingRecordService', 'AssessmentService', 'UserService', 'ApprovalService', 'PollingService',
	function ($scope, $state, loadedData, loadedPublishingValidity, PublishingRecordService, AssessmentService, UserService, ApprovalService, PollingService) {
		$scope.errors = loadedPublishingValidity.errors;
		$scope.messages = loadedPublishingValidity.messages;
		$scope.assessment = loadedData.data;
		$scope.publishingRecord = loadedPublishingValidity.data;
        $scope.updateIndicator = false;
        $scope.baseSimulationUrl = PublishingRecordService.getBaseUrl() + PublishingRecordService.getResource() + '/' + $scope.publishingRecord.id + '/simulate?purpose=';
        $scope.isAdminUser = false;
        $scope.allowLevel2 = true;
        $scope.assessmentlocked = false;
		if (!$state.current.searchParams) {
			$scope.searchParams = {"assessmentId": $scope.assessment.id, "sortKey":"version", "sortDir":"DESC", "pageSize" : 10, "currentPage": 1};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};
  		
        UserService.getCurrentUser().then(function(response) {
		    $scope.user = response.data;
		    $scope.permissions = response.data.authorities;
        	if($scope.user) {
        		
        		ApprovalService.isAdminUser().then(function(response) {
        			$scope.isAdminUser = response.data;
        		});
        	}
		});
        
        $scope.hasPermission = function(approval) {
        	var approvalFound = false;
        	if(approval.version == $scope.publishingRecord.version && $scope.permissions != null) {
            	for (var i = 0; i < $scope.permissions.length; i++) {
					var permission = $scope.permissions[i];
	        		if (permission.authority == approval.permission) {
	        			approvalFound = true;
	        			break;
	        		}
  	            }
        	}
        	return approvalFound;
        };
  		
  		$scope.getLatestApprovals = function() {
  			if ($scope.publishingRecord) {
		  		ApprovalService.retrieveLatestApprovals($scope.publishingRecord.id).then(function(response) {
		  			$scope.currentApprovals = response.data;
		  		});
  			}
  		};
        
        $scope.hasApprovedApproval = function() {
        	var approvedFound = false;
        	$scope.allowLevel2 = true;
        	if($scope.currentApprovals != null) {
	        	for (var i = 0; i < $scope.currentApprovals.length; i++) {
					var approval = $scope.currentApprovals[i];
	        		if (approval.status == 'Approved') {
	        			approvedFound = true;
	        		} else if (approval.level == 1) {
	        			$scope.allowLevel2 = false;
	        		}
	            }
        	}
        	return approvedFound;
        };
  		
  		$scope.getCurrentPublishingRecord = function() {
			PublishingRecordService.retrieveLatestStatus($scope.assessment.id).then(function(response) {
	  			$scope.publishingRecord = response.data;
				if ($scope.publishingRecord.publishingStatus == 'Publishing') {
					PollingService.startPolling('publishingPoll', PublishingRecordService.getBaseUrl() + PublishingRecordService.getResource() + '/' + $scope.publishingRecord.id, null, function(response) {
			  			$scope.publishingRecord = response.data;
			  			if ($scope.publishingRecord.publishingStatus == 'Published' || ($scope.publishingRecord.errorMessageText && $scope.publishingRecord.errorMessageText.length > 0)) {
			  				PollingService.stopPolling('publishingPoll');
							$scope.refreshInfo();
			  			}
					});
				} else {
					$scope.refreshInfo();
				}
	  		});
  		};

  		$scope.getLatestApprovals();
  		
        $scope.cancelApproval = function() {
        	if (confirmSave('cancel')) {
            	$scope.publishingRecord.publishingStatus = 'Rejected';
        		processSave();
        	}
        };
  		
        $scope.save = function(type) {
        	if (confirmSave('')) {
        		processSave(type);
        	}
        };
        
        $scope.updateApproval = function(approval, status) {
        	if (confirmSave(status)) {
        		approval.status = status;
        		approval.username = $scope.user.fullName;
        		ApprovalService.update(approval).then(function(response) {
                    $scope.errors = response.errors;
    				$scope.messages = response.messages;
					$scope.getCurrentPublishingRecord();
        		});
        	}
        };
        
        function confirmSave(status) {
        	var message = '';
        	if ($scope.publishingRecord.publishingStatus == 'In Progress') {
        		message = 'submit this assessment for approval';
        	} else if ($scope.publishingRecord.publishingStatus == 'Awaiting Approval') {
        		if (status == 'Approved') {
        			message = 'approve this approval request';
        		} else if(status == 'Rejected') {
        			message = 'reject this approval request';
        		} else {
        			message = 'cancel this approval request';
        		}
        	} else if ($scope.publishingRecord.publishingStatus == 'Published') {
        		message = 'start a new version of this assessment';
        	} else {
        		message = 'begin publishing process for this assessment';
        	}
        	
        	if (confirm("Are you sure you want to " + message + "?")) {
        		return true;
        	}
        	return false;
        }
        
        function processSave(type) {
        	$scope.updateIndicator = true;
        	PublishingRecordService.update($scope.publishingRecord, type == 'major').then( function(response) {
                $scope.errors = response.errors;
                $scope.updateIndicator = false;
				$scope.messages = response.messages;
				if ($scope.errors.length == 0) {
                    $scope.publishingRecord = response.data;
				}
				
	  			$scope.refreshInfo();
            });
        }
        
        $scope.refreshInfo = function() {
			AssessmentService.findById($scope.assessment.id).then(function (response) {
			    $scope.assessment.locked = response.data.locked;
			    $scope.assessment.status = response.data.status;
			    
			});
			$scope.getLatestApprovals();
        };

        $scope.processValidationErrors = function() {
	        angular.forEach($scope.publishingRecord.validationResultList, function(validationResult) {
                $scope.errors.push(validationResult.message);
            });
        };

		$scope.processValidationErrors();
}]);
