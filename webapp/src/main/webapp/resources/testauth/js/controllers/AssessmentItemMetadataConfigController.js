testauth.controller('AssessmentItemMetadataConfigController',['$scope','$state', 'loadedData', 'loadedItemMetadataConfig', 'itemMetadataKeys', 'ItemMetadataConfigService',
    function($scope, $state, loadedData, loadedItemMetadataConfig, itemMetadataKeys, ItemMetadataConfigService) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.assessment = loadedData.data;
        $scope.itemMetadataConfig = loadedItemMetadataConfig.data;
        $scope.itemMetadataKeys = itemMetadataKeys && itemMetadataKeys.data ? itemMetadataKeys.data.itemMetadataKeys : [];
		$scope.editItemMetadataConfig = true;
        $scope.itemMetadataConfig.assessmentId = $scope.assessment.id;
        $scope.availableItemMetadataKeys = [], $scope.requestedItemMetadataKeys = [];

		$scope.findItem = function(array, item) {
		    for (var i in array) {
		        if (array[i] == item) {
		            return true;
		        }
		    }
		};

		$scope.removeItem = function(array, item) {
		    for (var i in array) {
		        if (array[i] == item) {
		            array.splice(i,1);
		            break;
		        }
		    }
		};

        $scope.loadItemMetadataKeys = function(clearSelection) {
			$scope.availableItemMetadataKeys = [], $scope.requestedItemMetadataKeys = [];
    		if (clearSelection) {
				$scope.availableItemMetadataKeys = angular.copy($scope.itemMetadataKeys);
    		} else {
    			var allItemMetadataKeys = $scope.itemMetadataKeys;
				for (var i = 0, j = 0, k = 0; i < allItemMetadataKeys.length; i++) {
					if ($scope.findItem($scope.itemMetadataConfig.itemMetadataReckonSet, allItemMetadataKeys[i])) {
						$scope.requestedItemMetadataKeys[j++] = angular.copy(allItemMetadataKeys[i]);
					} else {
						$scope.availableItemMetadataKeys[k++] = angular.copy(allItemMetadataKeys[i]);
					}
				}
    		}

    		$scope.showItemMetadataKeys = true;
        };

		$scope.include = function() {
			for (var i = 0; i < $scope.itemMetadataConfig.availableItemMetadataKeys.length; i++) {
	        	$scope.requestedItemMetadataKeys.push(angular.copy($scope.itemMetadataConfig.availableItemMetadataKeys[i]));
	        }
        	$scope.itemMetadataConfig.availableItemMetadataKeys.splice(0, $scope.itemMetadataConfig.availableItemMetadataKeys.length);

	        for (var j = 0; j < $scope.requestedItemMetadataKeys.length; j++) {
	        	$scope.removeItem($scope.availableItemMetadataKeys, $scope.requestedItemMetadataKeys[j]);
	        }
		};
		
		$scope.exclude = function() {
			for (var i = 0; i < $scope.itemMetadataConfig.requestedItemMetadataKeys.length; i++) {
	        	$scope.availableItemMetadataKeys.push(angular.copy($scope.itemMetadataConfig.requestedItemMetadataKeys[i]));
	        }
			$scope.itemMetadataConfig.requestedItemMetadataKeys.splice(0, $scope.itemMetadataConfig.requestedItemMetadataKeys.length);

	        for (var j = 0; j < $scope.availableItemMetadataKeys.length; j++) {
	        	$scope.removeItem($scope.requestedItemMetadataKeys, $scope.availableItemMetadataKeys[j]);
	        }
		};

		$scope.setInclude = function() {
			$scope.includeActive = $scope.itemMetadataConfig.availableItemMetadataKeys.length;
		};
		
		$scope.setExclude = function() {
			$scope.excludeActive = $scope.itemMetadataConfig.requestedItemMetadataKeys.length;
		};

        $scope.save = function() {
        	if ($scope.editableForm.$dirty) {
                $scope.savingIndicator = true;
                $scope.itemMetadataConfig.assessmentId = $scope.assessment.id;
                $scope.itemMetadataConfig.itemMetadataReckonSet = [];
            	for (var i = $scope.requestedItemMetadataKeys.length - 1; i >= 0; i--) {
    	        	$scope.itemMetadataConfig.itemMetadataReckonSet[i] = $scope.requestedItemMetadataKeys[i];
    			}
                
                return ItemMetadataConfigService.save($scope.itemMetadataConfig).then(function(response) {
                    $scope.savingIndicator = false;
                    $scope.errors = response.errors;
                    $scope.messages = response.messages;
    				$scope.errorsMap = response.messages;
                    if ($scope.errors.length == 0) {
                        $scope.editableForm.$setPristine();
                        $scope.itemMetadataConfig = response.data;
                        $scope.editItemMetadataConfig = !$scope.editItemMetadataConfig;
    			        $scope.isNew = false;
                    } else {
    					angular.forEach($scope.errorsMap, function(msg,key){
    						var fieldName = key + "";
    						var message = msg + "";
    						$scope.editableForm.$setError(fieldName, message);
    					});
    					return "Error";
    				}
                });
        	} else {
                $scope.editItemMetadataConfig = !$scope.editItemMetadataConfig;
        	}
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
            $scope.editItemMetadataConfig = !$scope.editItemMetadataConfig;
            $scope.originalItemMetadataConfig = angular.copy($scope.itemMetadataConfig);
            $scope.editableForm.$show();
        };

        $scope.cancel = function() {
			$scope.errors = [];
			$scope.messages = {};
			$scope.errorsMap = {};
            $scope.editItemMetadataConfig = !$scope.editItemMetadataConfig;
            $scope.itemMetadataConfig = angular.copy($scope.originalItemMetadataConfig);
			$scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
	        $scope.loadItemMetadataKeys(false);
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });

        if ($scope.itemMetadataConfig && $scope.itemMetadataConfig.id) {
    		$scope.editItemMetadataConfig = false;
	        $scope.loadItemMetadataKeys(false);
	        $scope.isNew = false;
        } else {
			$scope.itemMetadataConfig = {};
			$scope.itemMetadataConfig.itemMetadataReckonSet = [];
	        $scope.loadItemMetadataKeys(true);
			$scope.isNew = true;
        }
}]);
