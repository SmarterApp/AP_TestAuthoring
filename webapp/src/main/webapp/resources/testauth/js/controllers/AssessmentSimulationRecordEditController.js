
testauth.controller('AssessmentSimulationRecordEditController', ['$scope', '$state', 'formAction', 'loadedData', 'loadedRecord', 'loadedFileGroup', 'FileGroupService', 'uploadManager', '$timeout',
	function ($scope, $state, formAction, loadedData, loadedRecord, loadedFileGroup, FileGroupService, uploadManager, $timeout) {
		$scope.errors = [];
		$scope.messages = [];
		$scope.assessment = loadedData.data;
		$scope.fileRecord = loadedRecord.data;
		$scope.fileGroup = angular.copy(loadedFileGroup.data);
		$scope.gridFile = {};
        $scope.fileIsUploading = false;
		$scope.queue = [];
		$scope.percentage = 0;

		if(!$scope.fileGroup) {
			$scope.fileGroup = {};
			$scope.fileGroup.gridFsIdList = [];
		}

		$scope.formAction = 'Add';
		if($scope.fileGroup && $scope.fileGroup.id) {
			$scope.formAction = 'Edit';
			$scope.isNew = false;
		} else {
			$scope.isNew = true;
		}
		
		$scope.back = function() {
			$scope.actionButton = 'cancel';
            var params = {};
            params.assessmentId = $scope.assessment.id;
            $state.transitionTo("assessmenthome.simulation", params);
		};

        $scope.cancel = function() {
            $scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
            $scope.messages = {};
            $scope.errors = [];
            $scope.errorsMap = {};
            $scope.fileGroup = angular.copy(loadedFileGroup.data);
        };

    	$scope.save = function() {
    		
    		$scope.fileRecord.assessmentId = $scope.assessment.id;
    		
    		return FileGroupService.saveSimulationRecord($scope.fileRecord).then( function(response) {
        		$scope.fileRecord = response.data;
                $scope.errors = response.errors;
				$scope.messages = response.messages;
				if ($scope.errors.length == 0) {
                    $scope.fileRecord = response.data;
                    $scope.fileGroup.simulationRecordId = $scope.fileRecord.id;
                    return saveFileGroup($scope.fileGroup);
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
    	
    	function saveFileGroup(fileGroup) {
    		return FileGroupService.save(fileGroup).then( function(groupResponse) {
            	$scope.errors = groupResponse.errors;
				$scope.messages = groupResponse.messages;
				if ($scope.errors.length == 0) {
                	$scope.fileGroup = groupResponse.data;
                	$scope.editableForm.$setPristine();
                	$scope.isNew = false;
                	$state.transitionTo("assessmenthome.simulationForm", { assessmentId : $scope.assessment.id, fileGroupId: $scope.fileGroup.id, formAction: 'Edit'});
				} else {
					angular.forEach($scope.errorsMap, function(msg,key){
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);
					});
					return "Error";
				}
            });
    	}
    	
	    $scope.downloadFile = function(file,event) {
    		window.open(FileGroupService.getBaseUrl() + FileGroupService.getResource() + '/gridFsFile/' + file.gridFsId);
    		event.preventDefault();
	    };
    	
	    $scope.deleteFile = function(gridFile, fileIndex) {
	    	if (confirm("Are you sure you want to remove this file?")) {
	    		if($scope.fileGroup.gridFiles.length > fileIndex) {
	    			
	    			FileGroupService.removeGridFile(gridFile).then( function(response) {
			    		$scope.errors = response.errors;
						$scope.messages = response.messages;
						
						if ($scope.errors.length == 0) {
							$scope.fileGroup.gridFiles.splice(fileIndex, 1);
							FileGroupService.save($scope.fileGroup).then( function(response) {
					    		$scope.errors = response.errors;
								$scope.messages = response.messages;
							});
						}
	    			});
	    		}
	    		event.preventDefault();
	    	}
	    };
    	
	    $scope.uploadRecordUrl = function(docType) {
	    	return FileGroupService.getBaseUrl() + FileGroupService.getResource() + '/gridFsFile';
	    };

	    $scope.$on('fileAdded', function (e, file) {
            $timeout(function() {
            	var maxFileByteSize = 300000;
            	if(file.files && file.files[0] && file.files[0].size > maxFileByteSize) {
                    file.files[0].error = "File upload is too large";
                    $scope.errors.push("File upload is too large");
            	} else {
					$scope.uploadSuccessMessage = null;
		    		$scope.gridFsFilename = file.files[0].name;
			        $scope.queue.push(file);
            	}
            });
	    });

	    $scope.$on('uploadProgress', function (e, call) {
            $timeout(function() {
		        $scope.percentage = call;
            });
	    });

	    $scope.$on('fileUploadError', function (e, data) {
	    	if (data.errorThrown || data.textStatus === 'error' || data.result.messages) {
	    		data.textStatus = 'error';
	    		$scope.removeFile(0);
                var message = data.result ? " - " + data.result.messages['applicationErrors'] : " upload error";
                data.files[0].error = (data.errorThrown || data.textStatus) + message;
                $scope.errors.push((data.errorThrown || data.textStatus) + message);
	    	}
		});

	    $scope.$on('fileUploadDone', function (e, data) {
            $timeout(function() {
	        	var uploadedFile = data.result;
	    		var indexToRemove = null;
	    		
	    		if(uploadedFile._id) {
		    		for(var a = 0; a < $scope.queue.length; a++){
		    			if ($scope.queue[a].$$hashKey === data.$$hashKey) {
		    				indexToRemove = a;
		    			}
		    		}
		    		
		    		//reset document
		    		$scope.gridFile = {};
		    		
		    		$scope.gridFile.gridFsId = uploadedFile._id.$oid;
		    		$scope.gridFile.fileName = uploadedFile.filename;
	            	
		    		if(!$scope.fileGroup.gridFiles) {
		    			$scope.fileGroup.gridFiles = [];
		    		}
	            	$scope.fileGroup.gridFiles.push($scope.gridFile);
	            	
		    		if (indexToRemove != null) {
		    			$scope.queue.splice(indexToRemove,1);
		    		}
		    		
		    		if($scope.queue.length == 0) {
			        	$scope.uploadSuccessMessage = "upload successful";
			        	$scope.gridFsFilename = null;
			        	$scope.save();
		    		}
	    		} else {
	    			// file did not upload properly
	    			$scope.$broadcast('fileUploadError', data);
	    		}
            });
		});
	    
		$scope.upload = function () {
			if($scope.fileGroup.name && $scope.queue && $scope.queue.length > 0) {
				return uploadManager.upload();
			} else {
				return $scope.save();
			}
		};

		$scope.removeFile = function (index) {
			$scope.queue.splice(index,1);
            $scope.$broadcast('fileRemoved', index);
    		$scope.gridFsFilename = null;
	    };
	    
  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    		if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
    			if(!confirm("You have unsaved changes. Are you sure you want to leave this page?")){
    				event.preventDefault();
    			}
	    	}
  		});
}]);
