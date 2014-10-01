
testauth.controller('AssessmentPsychometricRecordController', ['$scope', '$state', 'loadedData', 'loadedRecord', 'loadedPublishingRecord', 'FileGroupService', 'PublishingRecordService', 'uploadManager', '$timeout',
	function ($scope, $state, loadedData, loadedRecord, loadedPublishingRecord, FileGroupService, PublishingRecordService, uploadManager, $timeout) {
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.assessment = loadedData.data;
		$scope.publishingRecord = loadedPublishingRecord.data;
		$scope.fileRecord = loadedRecord.data;
		$scope.versionList = [];
		
		if(!$scope.fileRecord) {
			$scope.fileRecord = {};
		}
		
		FileGroupService.getPsychometricRecordByPublishingRecordId($scope.publishingRecord.id).then( function(response) {
			$scope.fileRecord = response.data;
		});
		
		$scope.getSearchParams = function() {
			if (!$state.current.searchParams) {
				$scope.searchParams = {"psychometricRecordId": $scope.fileRecord.id, "sortKey":"createDate", "sortDir":"DESC", "pageSize":10};
			} else {
				$scope.searchParams = $state.current.searchParams;
			}
		};
  		$scope.searchResponse = {};
  		$scope.getSearchParams();
  		
  		FileGroupService.getPsychometricRecordVersions($scope.assessment.id).then( function(response) {
  			$scope.versionList = response.data;
  		});
  		
  		$scope.broadcastSearch = function() {
  			$scope.$broadcast('initiate-docs-search');
  		};

  		$scope.searchDocs = function(params) {
			return FileGroupService.getPsychometricRecordByPublishingRecordId($scope.publishingRecord.id).then( function(response) {
				$scope.fileRecord = response.data;
				params.psychometricRecordId = $scope.fileRecord.id;
				params.assessmentId = $scope.assessment.id;
				if(!params.version) {
					params.version = $scope.fileRecord.version;
				}
				return FileGroupService.searchByPsychometricVersion(params);
			});
  		};
  		
        $scope.createNewGroup = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
        	params.fileGroupId = $scope.fileRecord.id;
        	$state.transitionTo("assessmenthome.psychometricForm", params);
        };
        
		$scope.view = function(fileGroup) {
			$state.transitionTo("assessmenthome.psychometricForm", { assessmentId : $scope.assessment.id, fileGroupId: fileGroup.id, formAction: 'View'});
		};

	    $scope.downloadFile = function(file) {
    		window.location = FileGroupService.getBaseUrl() + FileGroupService.getResource() + '/gridFsFile/' + file.gridFsId;
	    };
	    
	    $scope.removeGroup = function(fileGroup) {
	    	if (confirm("Are you sure you want to remove this group?")) {
		    	FileGroupService.remove(fileGroup).then( function(response) {
		    		$scope.errors = response.errors;
					$scope.messages = response.messages;
					if ($scope.errors.length == 0) {
						$scope.$broadcast('initiate-docs-search');
					}
		    	});
	    	}
	    };
	    
	    $scope.removeFile = function(fileGroup, gridFile, fileIndex) {
	    	if (confirm("Are you sure you want to remove this file?")) {
	    		if(fileGroup.gridFiles.length > fileIndex) {
	    			
	    			FileGroupService.removeGridFile(gridFile).then( function(response) {
			    		$scope.errors = response.errors;
						$scope.messages = response.messages;
						
						if ($scope.errors.length == 0) {
							fileGroup.gridFiles.splice(fileIndex, 1);
							FileGroupService.save(fileGroup).then( function(response) {
					    		$scope.errors = response.errors;
								$scope.messages = response.messages;
							});
						} else {
							$scope.$broadcast('initiate-docs-search');
						}
	    			});
	    		}
	    	}
	    };
	    
}]);
