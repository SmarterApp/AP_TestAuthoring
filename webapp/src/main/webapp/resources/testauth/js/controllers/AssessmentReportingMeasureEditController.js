testauth.controller('AssessmentReportingMeasureEditController',['$scope','$state', 'loadedData', 'loadedReportingMeasure', 'loadedReportingMeasureScoringRule', 'ReportingMeasureService', 'focus',
    function($scope, $state, loadedData, loadedReportingMeasure, loadedReportingMeasureScoringRule, ReportingMeasureService, focus) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.reportingMeasure = loadedReportingMeasure.data;
        $scope.scoringRules = loadedReportingMeasureScoringRule.data;
		$scope.editReportingMeasure = true;
        $scope.reportingMeasure.assessmentId = $scope.assessment.id;
        $scope.availableScoringRules = [], $scope.requestedScoringRules = [];
        $scope.configuredBlueprintReferenceTypes = [], $scope.configuredBlueprintReferenceNames = [];
        $scope.blueprintReference = {};

		for (var i = 0; i < $scope.scoringRules.searchResults.length; i++) {
			var scoringRule = $scope.scoringRules.searchResults[i];
			if (!$scope.blueprintReference[scoringRule.blueprintReferenceType]) {
				$scope.blueprintReference[scoringRule.blueprintReferenceType] = {};
				$scope.configuredBlueprintReferenceTypes.push(scoringRule.blueprintReferenceType);
			}
			if (!$scope.blueprintReference[scoringRule.blueprintReferenceType][scoringRule.blueprintReferenceName]) {
				$scope.blueprintReference[scoringRule.blueprintReferenceType][scoringRule.blueprintReferenceName] = {"blueprintReferenceId" : scoringRule.blueprintReferenceId, "blueprintDenotationType":scoringRule.blueprintDenotationType, "scoringRules":[]};
			}
			$scope.blueprintReference[scoringRule.blueprintReferenceType][scoringRule.blueprintReferenceName].scoringRules.push(scoringRule);
		}

		$scope.findItem = function(array, item) {
		    for (var i in array) {
		        if (array[i].id == item.id) {
		            return true;
		        }
		    }
		};

		$scope.removeItem = function(array, item) {
		    for (var i in array) {
		        if (array[i].id == item.id) {
		            array.splice(i,1);
		            break;
		        }
		    }
		};

        $scope.loadReferenceNames = function(clearSelection, data, deno) {
        	$scope.reportingMeasure.blueprintReferenceType = data;
        	if (deno) {
            	$scope.reportingMeasure.blueprintDenotationType = deno;
        	}
    		if (clearSelection) {
        		$scope.showScoringRule = false;
        		$scope.reportingMeasure.blueprintReferenceName = null;
        		$scope.reportingMeasure.blueprintDenotationType = null;
        		$scope.reportingMeasure.blueprintReferenceId = null;
        		$scope.configuredBlueprintReferenceNames = [];
        		$scope.requestedScoringRules = [];
    		}
            $scope.showReferenceName = $scope.reportingMeasure.blueprintReferenceType != null;
            for (key in $scope.blueprintReference[$scope.reportingMeasure.blueprintReferenceType]) {
            	$scope.configuredBlueprintReferenceNames.push(key);
            }
		};

        $scope.loadScoringRules = function(clearSelection, data) {
        	$scope.reportingMeasure.blueprintReferenceName = data;
			$scope.availableScoringRules = [], $scope.requestedScoringRules = [];
    		if (clearSelection) {
    			var blueprintReference = $scope.blueprintReference[$scope.reportingMeasure.blueprintReferenceType][$scope.reportingMeasure.blueprintReferenceName];
    			$scope.reportingMeasure.blueprintDenotationType = blueprintReference.blueprintDenotationType;
    			$scope.reportingMeasure.blueprintReferenceId = blueprintReference.blueprintReferenceId;
				$scope.availableScoringRules = angular.copy(blueprintReference.scoringRules);
    		} else {
    			var allScoringRules = $scope.blueprintReference[$scope.reportingMeasure.blueprintReferenceType][$scope.reportingMeasure.blueprintReferenceName].scoringRules;
				for (var i = 0, j = 0, k = 0; i < allScoringRules.length; i++) {
					if ($scope.findItem($scope.reportingMeasure.scoringRuleList, allScoringRules[i])) {
						$scope.requestedScoringRules[j++] = angular.copy(allScoringRules[i]);
					} else {
						$scope.availableScoringRules[k++] = angular.copy(allScoringRules[i]);
					}
				}
    		}

    		$scope.showScoringRule = true;
        };

		$scope.include = function() {
			for (var i = 0; i < $scope.reportingMeasure.availableSelectedScoringRules.length; i++) {
	        	$scope.requestedScoringRules.push(angular.copy($scope.reportingMeasure.availableSelectedScoringRules[i]));
	        }
        	$scope.reportingMeasure.availableSelectedScoringRules.splice(0, $scope.reportingMeasure.availableSelectedScoringRules.length);

	        for (var j = 0; j < $scope.requestedScoringRules.length; j++) {
	        	$scope.removeItem($scope.availableScoringRules, $scope.requestedScoringRules[j]);
	        }
		};
		
		$scope.exclude = function() {
			for (var i = 0; i < $scope.reportingMeasure.requestedSelectedScoringRules.length; i++) {
	        	$scope.availableScoringRules.push(angular.copy($scope.reportingMeasure.requestedSelectedScoringRules[i]));
	        }
			$scope.reportingMeasure.requestedSelectedScoringRules.splice(0, $scope.reportingMeasure.requestedSelectedScoringRules.length);

	        for (var j = 0; j < $scope.availableScoringRules.length; j++) {
	        	$scope.removeItem($scope.requestedScoringRules, $scope.availableScoringRules[j]);
	        }
		};

		$scope.setInclude = function() {
			$scope.includeActive = $scope.reportingMeasure.availableSelectedScoringRules.length;
		};
		
		$scope.setExclude = function() {
			$scope.excludeActive = $scope.reportingMeasure.requestedSelectedScoringRules.length;
		};

        $scope.save = function() {
            $scope.savingIndicator = true;
            $scope.reportingMeasure.scoringRuleIdList = [];
        	for (var i = $scope.requestedScoringRules.length - 1; i >= 0; i--) {
	        	$scope.reportingMeasure.scoringRuleIdList[i] = $scope.requestedScoringRules[i].id;
			}
        	$scope.reportingMeasure.scoringRuleList = null;
            
            return ReportingMeasureService.save($scope.reportingMeasure).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
				$scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.editableForm.$setPristine();
                    $scope.reportingMeasure = response.data;
			        $scope.toggleEditor();
			        $scope.isNew = false;
			        $state.transitionTo("assessmenthome.reportingmeasureedit", {assessmentId:$scope.assessment.id, reportingMeasureId:$scope.reportingMeasure.id});
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

        $scope.toggleEditor = function() {
            $scope.editReportingMeasure = !$scope.editReportingMeasure;
            $scope.formAction = $scope.editReportingMeasure ? 'Edit' : 'View';
		};

        $scope.openEditor = function() {
        	$scope.toggleEditor();
			focus('focusEdit');
            $scope.originalReportingMeasure = angular.copy($scope.reportingMeasure);
            $scope.editableForm.$show();
        };

        $scope.cancelEditor = function() {
			$scope.errors = [];
			$scope.messages = {};
			$scope.errorsMap = {};
			$scope.editableForm.$setPristine();
			$scope.editableForm.$cancel();
            $scope.reportingMeasure = angular.copy($scope.originalReportingMeasure);
			$scope.loadReferenceNames(false, $scope.reportingMeasure.blueprintReferenceType, $scope.reportingMeasure.blueprintDenotationType);
	        $scope.loadScoringRules(false, $scope.reportingMeasure.blueprintReferenceName);
        	$scope.toggleEditor();
        };

        $scope.returnToSearch = function() {
			$scope.editableForm.$setPristine();
			$state.transitionTo("assessmenthome.reportingmeasures", {assessmentId:$scope.assessment.id});
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
        if ($scope.reportingMeasure && $scope.reportingMeasure.id) {
    		$scope.editReportingMeasure = false;
            $scope.formAction = 'View';
			$scope.loadReferenceNames(false, $scope.reportingMeasure.blueprintReferenceType, $scope.reportingMeasure.blueprintDenotationType);
	        $scope.loadScoringRules(false, $scope.reportingMeasure.blueprintReferenceName);
	        $scope.isNew = false;
        } else {
			focus('focusEdit');
			$scope.isNew = true;
        }

}]);
