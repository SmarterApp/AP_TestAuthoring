
testauth.controller('AssessmentSimulationRecordController', ['$scope', '$state', 'loadedData', 'loadedRecord', 'FileGroupService', 'uploadManager', 
	function ($scope, $state, loadedData, loadedRecord, FileGroupService, uploadManager) {
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.assessment = loadedData.data;
		$scope.fileRecord = loadedRecord.data;
		$scope.versionList = [];
		
		if(!$scope.fileRecord) {
			$scope.fileRecord = {};
		}
		
		$scope.getSearchParams = function() {
			if (!$state.current.searchParams) {
				$scope.searchParams = {"simulationRecordId": $scope.fileRecord.id, "sortKey":"createDate", "sortDir":"DESC", "currentPage": 1, "pageSize":10};
			} else {
				$scope.searchParams = $state.current.searchParams;
			}
		};
  		$scope.searchResponse = {};
  		$scope.getSearchParams();
  		
  		$scope.broadcastSearch = function() {
  			$scope.$broadcast('initiate-docs-search');
  		};

  		$scope.searchDocs = function(params) {
  			return FileGroupService.search(params);
  		};
  		
        $scope.createNewGroup = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
        	params.fileGroupId = "";
        	$state.transitionTo("assessmenthome.simulationForm", params);
        };
        
		$scope.view = function(fileGroup) {
			$state.transitionTo("assessmenthome.simulationForm", { assessmentId : $scope.assessment.id, fileGroupId: fileGroup.id, formAction: 'View'});
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
