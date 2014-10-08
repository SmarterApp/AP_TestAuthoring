testauth.controller('AssessmentPerformanceLevelEditController',['$scope','$state', 'loadedData', 'loadedPerformanceLevel', 'loadedBlueprintReferenceTypes', 'PerformanceLevelService', 'SegmentService', 'BlueprintElementService', 'AffinityGroupService', 'focus', 
    function($scope, $state, loadedData, loadedPerformanceLevel, loadedBlueprintReferenceTypes, PerformanceLevelService, SegmentService, BlueprintElementService, AffinityGroupService, focus) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.performanceLevel = loadedPerformanceLevel.data;
        $scope.performanceLevel.assessmentId = $scope.assessment.id;
        $scope.blueprintReferenceTypes = loadedBlueprintReferenceTypes.data;
        
        $scope.blueprintReferenceNames = [], $scope.segmentNames = [], $scope.affinityGroupNames = [], $scope.blueprintElementNames = [];
                       
        $scope.sortablePerformanceLevelValueOptions = {
            disabled: true,
            update: function(e, ui) {
                $scope.editableForm.$setDirty();
            }
        };
        
        $scope.isSortHidden = function() {
            return !$scope.editPerformanceLevel || $scope.performanceLevel.performanceLevelValues.length == 1;
        };
        
        $scope.setUpdated = function() {
        	$scope.editableForm.$setDirty();
        };
        
        $scope.addItem = function() {
            $scope.editableForm.$setDirty();
            if (!$scope.performanceLevel.performanceLevelValues) {
                $scope.performanceLevel.performanceLevelValues = [];
            }
            $scope.performanceLevel.performanceLevelValues.push({
                "level" : $scope.performanceLevel.performanceLevelValues.length + 1,
                "scaledLo" : "",
                "scaledHi" : ""
            });
            focus('focusNewParam');
        };
        
        $scope.removeItem = function (index) {
            $scope.editableForm.$setDirty();
            $scope.performanceLevel.performanceLevelValues.splice(index,1);
        };

        $scope.save = function() {
            $scope.savingIndicator = true;
            
            angular.forEach($scope.performanceLevel.performanceLevelValues, function(value,indx) {
                value.level = indx + 1;
            });
            
            return PerformanceLevelService.save($scope.performanceLevel).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
				$scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.editableForm.$setPristine();
                    $scope.performanceLevel = response.data;
                    $scope.toggleEditor();
        			$scope.isNew = false;
        			$state.transitionTo("assessmenthome.performanceleveledit", {assessmentId:$scope.assessment.id, performanceLevelId:$scope.performanceLevel.id});
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
        
        $scope.loadReferenceNames = function(clearSelection, data) {
        	$scope.performanceLevel.blueprintReferenceType = data;
            if (clearSelection) {
                $scope.performanceLevel.blueprintReferenceId = null;
                if ($scope.editableForm.blueprintReferenceId) {
                    $scope.editableForm.blueprintReferenceId.$setViewValue("");
                }
            }

            if ($scope.assessment.id) {
                var bpReferenceSearchParams = { "assessmentId":$scope.assessment.id, "sortKey":"name", "sortDir":"asc", "pageSize":"1000" };
                if ($scope.performanceLevel.blueprintReferenceType == 'Assessment') {
                    $scope.performanceLevel.blueprintReferenceId = $scope.assessment.id;
                    $scope.showReferenceName = false;
                } else if ($scope.performanceLevel.blueprintReferenceType == 'Segment') {
                    if (!$scope.segmentNames || $scope.segmentNames.length == 0) {
                        $scope.segmentNames = [];
                        bpReferenceSearchParams.sortKey = "position";
                        SegmentService.search(bpReferenceSearchParams).then( function(response) {
                            angular.forEach(response.data.searchResults, function(segment) {
                                $scope.segmentNames.push({ "id":segment.id, "name":segment.position + ' - ' + segment.label });
                            });
                        });
                    }
                    $scope.blueprintReferenceNames = $scope.segmentNames;
                    $scope.showReferenceName = true;
                } else if ($scope.performanceLevel.blueprintReferenceType == 'Affinity Group') {
                    if (!$scope.affinityGroupNames || $scope.affinityGroupNames.length == 0) {
                        $scope.affinityGroupNames = [];
                        bpReferenceSearchParams.sortKey = "groupName";
                        bpReferenceSearchParams.active = "true";
                        AffinityGroupService.search(bpReferenceSearchParams).then( function(response) {
                            angular.forEach(response.data.searchResults, function(affinityGroup) {
                                $scope.affinityGroupNames.push({ "id":affinityGroup.id, "name":affinityGroup.groupName });
                            });
                        });
                    }
                    $scope.blueprintReferenceNames = $scope.affinityGroupNames;
                    $scope.showReferenceName = true;
                } else if ($scope.performanceLevel.blueprintReferenceType == 'Blueprint Standard') {
                    if (!$scope.blueprintElementNames || $scope.blueprintElementNames.length == 0) {
                        $scope.blueprintElementNames = [];
                        bpReferenceSearchParams.sortKey = "standardKey";
                        bpReferenceSearchParams.active = "true";
                        BlueprintElementService.search(bpReferenceSearchParams).then( function(response) {
                            angular.forEach(response.data.searchResults, function(blueprintElement) {
                                $scope.blueprintElementNames.push({ "id":blueprintElement.id, "name":blueprintElement.standardKey });
                            });
                        });
                   }
                   $scope.blueprintReferenceNames = $scope.blueprintElementNames;
                   $scope.showReferenceName = true;
               }
            } else {
                 $scope.blueprintReferenceNames = [];
                 $scope.showReferenceName = false;
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
        
        $scope.toggleEditor = function() {
            $scope.editPerformanceLevel = !$scope.editPerformanceLevel;
            $scope.formAction = $scope.editPerformanceLevel ? 'Edit' : 'View';
            $scope.sortablePerformanceLevelValueOptions.disabled = !$scope.editPerformanceLevel;
        };

        $scope.openEditor = function() {
            $scope.toggleEditor();
            focus('focusEdit');
            $scope.originalPerformanceLevel = angular.copy($scope.performanceLevel);
        };

        $scope.cancelEditor = function() {
            $scope.errors = [];
            $scope.messages = {};
            $scope.editableForm.$setPristine();
            $scope.performanceLevel = angular.copy($scope.originalPerformanceLevel);
            $scope.loadReferenceNames(false, $scope.performanceLevel.blueprintReferenceType);
            $scope.toggleEditor();
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

        $scope.hasRowError = function(index) {
            return $scope.hasFieldError('performanceLevelValues[' + index + ']');
        };

        $scope.hasGridFieldError = function(index, fieldName) {
            return $scope.hasFieldError('performanceLevelValues[' + index + '].' + fieldName);
        };

        $scope.fieldErrorText = function(fieldName) {
            var messageMap = $scope.messages;
            var fieldMap = messageMap ? messageMap[fieldName] : null;
            return fieldMap ? fieldMap.join('\n') : '';
        };
        
        $scope.returnToSearch = function() {
            $scope.editableForm.$setPristine();
            $state.transitionTo("assessmenthome.performancelevel", {assessmentId:$scope.assessment.id});
        };
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
        
        $scope.actionButton = '';
        if ($scope.performanceLevel && $scope.performanceLevel.id) {
            $scope.formAction = 'View';
            $scope.editPerformanceLevel = false;
            $scope.loadReferenceNames(false, $scope.performanceLevel.blueprintReferenceType);
			$scope.isNew = false;
        } else {
            $scope.formAction = 'Add';
            $scope.editPerformanceLevel = true;
			$scope.isNew = true;
        }

    }]);
