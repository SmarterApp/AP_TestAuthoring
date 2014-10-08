
testauth.controller('AssessmentScoringRuleEditController',['$scope','$state', 'loadedData', 'loadedScoringRule', 'loadedBlueprintReferenceTypes', 'loadedBlueprintDenotationTypes', 'scoringRuleList', 'ScoringRuleService', 'ComputationRuleService', 'SegmentService', 'AffinityGroupService', 'BlueprintElementService', 'focus', 'uploadManager', '$timeout',
    function($scope, $state, loadedData, loadedScoringRule, loadedBlueprintReferenceTypes, loadedBlueprintDenotationTypes, scoringRuleList, ScoringRuleService, ComputationRuleService, SegmentService, AffinityGroupService, BlueprintElementService, focus, uploadManager, $timeout) {
        $scope.savingIndicator = false;
        $scope.errors = loadedScoringRule.errors;
        $scope.messages = loadedScoringRule.messages;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.scoringRule = loadedScoringRule.data;
        $scope.scoringRuleList = scoringRuleList.data.searchResults;
        $scope.scoringRule.assessmentId = $scope.assessment.id;
        $scope.editScoringRule = true;
        $scope.computationRules = [], $scope.blueprintReferenceNames = [], $scope.segmentNames = [], $scope.affinityGroupNames = [], $scope.blueprintElementNames = [], $scope.blueprintLevels = [];
        $scope.setAsideDictionaryDefaults = [];
        $scope.selectedComputationRuleParams = {};
        $scope.conversionTableType = null, $scope.uploadMessage = null;
        $scope.queue = [], $scope.fileIdsToDelete = [];
        $scope.percentage = 0;
        $scope.availableBlueprintReferenceTypes = loadedBlueprintReferenceTypes.data;
        $scope.blueprintDenotationTypes = loadedBlueprintDenotationTypes.data;
        $scope.conversionTableBaseUrl = ScoringRuleService.getBaseUrl() + ScoringRuleService.getResource() + '/conversionTableFile/';
        $scope.valueConversionTableUrl = $scope.conversionTableBaseUrl + 'value';
        $scope.standardErrorConversionTableUrl = $scope.conversionTableBaseUrl + 'standardError';

        var computationRuleNameParams = { "sortKey" : "name,version", "sortDir" : "asc", "pageSize" : "1000" };
        ComputationRuleService.search(computationRuleNameParams).then( function(response) {
            $scope.computationRules = response.data.searchResults;
        });

        // file upload processing start ==========================================================================================================
        $scope.setTableType = function(type) {
            $scope.conversionTableType = type;
        };

        $scope.conversionTableUrl = function(type) {
            return type === 'value' ? $scope.valueConversionTableUrl : $scope.standardErrorConversionTableUrl;
        };

        $scope.$on('fileAdded', function (e, file) {
            $timeout(function() {
                $scope.editableForm.$setDirty();
                $scope.uploadMessage = null;
                if ($scope.conversionTableType == 'value') {
                    $scope.scoringRule.valueConversionTableFilename = file.files[0].name;
                    $scope.valueInQueue = true;
                } else {
                    $scope.scoringRule.standardErrorConversionTableFilename = file.files[0].name;
                    $scope.standardErrorInQueue = true;
                }
                $scope.queue.push(file);
            });
        });

        $scope.removeFile = function (index) {
            var removedFile = $scope.queue.splice(index,1);
            $scope.$broadcast('fileRemoved', index);
            $scope.uploadMessage = null;
            if (removedFile[0].files[0].name == $scope.scoringRule.valueConversionTableFilename) {
                $scope.scoringRule.valueConversionTableFilename = null;
                $scope.valueInQueue = false;
            } else {
                $scope.scoringRule.standardErrorConversionTableFilename = null;
                $scope.standardErrorInQueue = false;
            }
        };

        $scope.upload = function () {
            uploadManager.upload();
        };

        $scope.$on('uploadProgress', function (e, call) {
            $timeout(function() {
                $scope.percentage = call;
            });
        });

        $scope.$on('fileUploadError', function (e, data) {
            if (data.errorThrown || data.textStatus === 'error' || data.result.messages) {
                var message = data.result ? " - " + data.result.messages['applicationErrors'] : " upload error";  
                data.files[0].error = (data.errorThrown || data.textStatus) + message;
                $scope.errors.push((data.errorThrown || data.textStatus) + message);
            }
        });

        $scope.$on('fileUploadDone', function (e, data) {
            $timeout(function() {
                if (data.errorThrown || data.textStatus === 'error' || data.result.messages) {
                    var message = data.result ? " - " + data.result.messages['applicationErrors'] : " upload error";  
                    data.files[0].error = (data.errorThrown || data.textStatus) + message;
                    $scope.errors.push((data.errorThrown || '') + message);
                    $scope.uploadMessage = "upload failed";
                } else {
                    $scope.errors = [];
                    var uploadedFile = data.result;
                    var indexToRemove = null;
                    for (var a = 0; a < $scope.queue.length; a++) {
                        if ($scope.queue[a].$$hashKey === data.$$hashKey) {
                            indexToRemove = a;
                        }
                    }
                    if (indexToRemove != null) {
                        $scope.queue.splice(indexToRemove,1);
                    }
                    if ($scope.valueInQueue && uploadedFile.filename === $scope.scoringRule.valueConversionTableFilename) {
                        $scope.scoringRule.valueConversionTableGridFsId = uploadedFile._id.$oid;
                        $scope.valueInQueue = false;
                    } else if ($scope.standardErrorInQueue && uploadedFile.filename === $scope.scoringRule.standardErrorConversionTableFilename) {
                        $scope.scoringRule.standardErrorConversionTableGridFsId = uploadedFile._id.$oid;
                        $scope.standardErrorInQueue = false;
                    }
                    $scope.uploadMessage = "upload successful";
                }
            });
        });

        $scope.deleteFile = function(type) {
            if (type == 'value') {
                $scope.fileIdsToDelete.push($scope.scoringRule.valueConversionTableGridFsId);
                $scope.scoringRule.valueConversionTableGridFsId = null;
                $scope.scoringRule.valueConversionTableFilename = null;
            } else {
                $scope.fileIdsToDelete.push($scope.scoringRule.standardErrorConversionTableGridFsId);
                $scope.scoringRule.standardErrorConversionTableGridFsId = null;
                $scope.scoringRule.standardErrorConversionTableFilename = null;
            }
            $scope.uploadMessage = null;
        };
        // file upload processing finish =========================================================================================================

        $scope.loadReferenceNames = function(clearSelection, data) {
            $scope.scoringRule.blueprintReferenceType = data;
            if (clearSelection) {
                if ($scope.editableForm.blueprintReferenceId) {
                    $scope.editableForm.blueprintReferenceId.$setViewValue("");
                }
                if ($scope.editableForm.blueprintDenotationType) {
                    $scope.editableForm.blueprintDenotationType.$setViewValue(null);
                }
                $scope.scoringRule.blueprintReferenceId = null;
                $scope.scoringRule.blueprintDenotationType = null;
            }

            if ($scope.assessment.id) {
                $scope.blueprintReferenceNames = [];
                $scope.showDenotation = false;
                $scope.showReferenceName = false;
                var blueprintReferenceNameParams = { "assessmentId":$scope.assessment.id, "sortKey" : "name", "sortDir" : "asc", "pageSize" : "1000" };
                if ($scope.scoringRule.blueprintReferenceType == 'Assessment') {
                    $scope.scoringRule.blueprintReferenceId = $scope.assessment.id;
                } else if ($scope.scoringRule.blueprintReferenceType == 'Segment') {
                    if (!$scope.segmentNames || $scope.segmentNames.length == 0) {
                        blueprintReferenceNameParams.sortKey = "position";
                        SegmentService.search(blueprintReferenceNameParams).then( function(response) {
                        	if (response.data.searchResults.length > 0) {
	                            for (var i = 0; i < response.data.searchResults.length; i++) {
	                                var segment = response.data.searchResults[i];
	                                $scope.segmentNames.push({"id" : segment.id, "name" : segment.position + ' - ' + segment.label});
	                            }
	                            $scope.showReferenceName = true;
                        	}
                        });
                    }
                    if ($scope.segmentNames.length > 0) {
                        $scope.showReferenceName = true;
                    }
                    $scope.blueprintReferenceNames = $scope.segmentNames;
                } else if ($scope.scoringRule.blueprintReferenceType == 'Affinity Group') {
                    if (!$scope.affinityGroupNames || $scope.affinityGroupNames.length == 0) {
                        blueprintReferenceNameParams.sortKey = "groupName";
                        blueprintReferenceNameParams.active = "true";
                        AffinityGroupService.search(blueprintReferenceNameParams).then( function(response) {
                        	if (response.data.searchResults.length > 0) {
                                for (var i = 0; i < response.data.searchResults.length; i++) {
                                    var affinityGroup = response.data.searchResults[i];
                                    $scope.affinityGroupNames.push({"id" : affinityGroup.id, "name" : affinityGroup.groupName});
                                }
                                $scope.showReferenceName = true;
                        	}
                        });
                    }
                    if ($scope.affinityGroupNames.length > 0) {
                        $scope.showReferenceName = true;
                    }
                    $scope.blueprintReferenceNames = $scope.affinityGroupNames;
                } else if ($scope.scoringRule.blueprintReferenceType == 'Blueprint Standard') {
                    var blueprintReferenceNameParams = { "assessmentId":$scope.assessment.id, "sortKey" : "standardKey", "active" : "true", "sortDir" : "asc", "pageSize" : "1000" };
                    BlueprintElementService.search(blueprintReferenceNameParams).then( function(response) {
                    	if (response.data.searchResults.length > 0) {
                            $scope.showDenotation = true;
                    	}
                    });
                }
            }
        };

        $scope.loadDenotationChoice = function(clearSelection, data) {
            if (clearSelection) {
                $scope.scoringRule.blueprintDenotationType = data;
                if ($scope.editableForm.blueprintReferenceId) {
                    $scope.editableForm.blueprintReferenceId.$setViewValue("");
                }
                $scope.scoringRule.blueprintReferenceId = null;
            }

            var blueprintReferenceNameParams = { "assessmentId":$scope.assessment.id, "sortKey" : "standardKey", "active" : "true", "sortDir" : "asc", "pageSize" : "1000" };
            BlueprintElementService.search(blueprintReferenceNameParams).then( function(response) {
            	if (response.data.searchResults.length > 0) {
                	if ($scope.scoringRule.blueprintDenotationType == 'Standard Key') {
                        if (!$scope.blueprintElementNames || $scope.blueprintElementNames.length == 0) {
                            for (var i = 0; i < response.data.searchResults.length; i++) {
                                var blueprintElement = response.data.searchResults[i];
                                $scope.blueprintElementNames.push({"id" : blueprintElement.id, "name" : blueprintElement.standardKey});
                            }
                        }
                        $scope.blueprintReferenceNames = $scope.blueprintElementNames;
                        $scope.showReferenceName = true;
                	} else if ($scope.scoringRule.blueprintDenotationType == 'Level') {
                        if (!$scope.blueprintLevels || $scope.blueprintLevels.length == 0) {
                            ScoringRuleService.findDistinctActiveLevelsForAssessment($scope.assessment.id).then( function(srResponse) {
                                for (var key in srResponse.data) {
                                    $scope.blueprintLevels.push({"id" : key, "name" : srResponse.data[key]});
                                }
                            });
                        }
                        $scope.blueprintReferenceNames = $scope.blueprintLevels;
                        $scope.showReferenceName = true;
                	} else if ($scope.scoringRule.blueprintDenotationType == 'Leaf Nodes') {
                		$scope.blueprintReferenceNames = [];
                        $scope.showReferenceName = false;
                	}
            	}
            });
        };
        
        $scope.sortableScoringRuleParamDictionaryOptions = {
            cursor: "move",
            disabled: true,
            update: function(e, ui) {
                $scope.editableForm.$setDirty();
            }
        };
        
        $scope.loadComputationRuleChoice = function(clearSelection, data) {
            $scope.scoringRule.computationRuleId = data;
            if (clearSelection) {
                $scope.scoringRule.valueConversionTableGridFsId = null;
                $scope.scoringRule.valueConversionTableFilename = null;
                $scope.scoringRule.standardErrorConversionTableGridFsId = null;
                $scope.scoringRule.standardErrorConversionTableFilename = null;
                $scope.uploadMessage = null;
            }
            $scope.setAsideDictionaryDefaults = [];
            $scope.selectedComputationRuleParams = {};
            if (clearSelection) {
                $scope.editableForm.$setDirty();
                $scope.scoringRule.computationRule = null;
                $scope.scoringRule.parameters = [];
                for (var i = 0; i < $scope.computationRules.length; i++) {
                    var computationRule = $scope.computationRules[i];
                    
                    if ($scope.scoringRule.computationRuleId === computationRule.id )  {
                        if (computationRule.parameters) {
                            for (var ii = 0; ii < computationRule.parameters.length; ii++) {
                                var computationRuleParameter = computationRule.parameters[ii];
                                $scope.selectedComputationRuleParams[computationRuleParameter.parameterName] = computationRuleParameter;
                                if (computationRuleParameter.computationRuleMultiplicityType === 'Dictionary') {
                                    $scope.scoringRule.parameters.push({
                                        "computationRuleParameterName" : computationRuleParameter.parameterName,
                                        "computationRuleParameterMultiplicity" : computationRuleParameter.computationRuleMultiplicityType,
                                        "dictionaryValue" : [{
                                            "key" : "",
                                            "value" : computationRuleParameter.defaultValue
                                        }]
                                    });
                                    $scope.setAsideDictionaryDefaults.push({"name" : computationRuleParameter.parameterName, "defaultValue" : computationRuleParameter.defaultValue});
                                } else {
                                    $scope.scoringRule.parameters.push({
                                        "computationRuleParameterName" : computationRuleParameter.parameterName,
                                        "computationRuleParameterMultiplicity" : computationRuleParameter.computationRuleMultiplicityType,
                                        "scalarValue" : computationRuleParameter.defaultValue
                                    });
                                }
                            }
                        }

                        if (computationRule.conversionTableType == 'Value') {
                            $scope.showValueConversionTable = true;
                            $scope.showStandardErrorConversionTable = false;
                        } else if (computationRule.conversionTableType == 'Value & Standard Error') {
                            $scope.showValueConversionTable = true;
                            $scope.showStandardErrorConversionTable = true;
                        } else {
                            $scope.showValueConversionTable = false;
                            $scope.showStandardErrorConversionTable = false;
                        }
                        $scope.scoringRule.computationRule = computationRule;
                        break;
                    }
                }
            } else {
                if ($scope.scoringRule.computationRule.parameters) {
                    for (var i = 0; i < $scope.scoringRule.computationRule.parameters.length; i++) {
                        var computationRuleParameter = $scope.scoringRule.computationRule.parameters[i];
                        $scope.selectedComputationRuleParams[computationRuleParameter.parameterName] = computationRuleParameter;
                        if (computationRuleParameter.computationRuleMultiplicityType === 'Dictionary') {
                            $scope.setAsideDictionaryDefaults.push({"name" : computationRuleParameter.parameterName, "defaultValue" : computationRuleParameter.defaultValue});
                        }
                    }
                }
                var conversionTableType = $scope.scoringRule.computationRule.conversionTableType;
                $scope.showValueConversionTable = conversionTableType == 'Value' || conversionTableType == 'Value & Standard Error';
                $scope.showStandardErrorConversionTable = conversionTableType == 'Value & Standard Error';
            }
        };

        $scope.removeDictionaryItem = function(parentIndex, index) {
            $scope.scoringRule.parameters[parentIndex].dictionaryValue.splice(index, 1);
            $scope.editableForm.$setDirty();
        };

        $scope.addDictionaryItem = function(parameter, parentIndex) {
            var dictionaryDefault = null;
            for (var i = 0; i < $scope.setAsideDictionaryDefaults.length; i++) {
                dictionaryDefault = $scope.setAsideDictionaryDefaults[i];
                if (dictionaryDefault.name == parameter.computationRuleParameterName) {
                    break;
                }
            }
            $scope.scoringRule.parameters[parentIndex].dictionaryValue.push({
                "key" : "",
                "value" : ""+dictionaryDefault.defaultValue
            });
            focus(parentIndex+'-focusNewParam');
            $scope.editableForm.$setDirty();
        };

        $scope.save = function() {
            $scope.savingIndicator = true;

            return ScoringRuleService.save($scope.scoringRule).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
                $scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.isNew = false;
                    $scope.editableForm.$setPristine();
                    var deleteErrors =[];
                    for (var i = 0; i < $scope.fileIdsToDelete.length; i++) {
                        ScoringRuleService.removeConversionTableFile($scope.fileIdsToDelete[i]).then(function(response) {
                            $scope.errors = response.errors;
                            $scope.messages = response.messages;
                            if ($scope.errors.length > 0) {
                                deleteErrors.push($scope.errors);
                            }
                        });
                    }
                    if (deleteErrors.length > 0) {
                        $scope.errors.push(deleteErrors);
                    }
                    $scope.uploadMessage = null;
                    $scope.scoringRule = response.data;
                    $scope.toggleEditor();
                    $state.transitionTo("assessmenthome.scoringruleedit", {assessmentId:$scope.assessment.id, scoringRuleId:$scope.scoringRule.id});
                } else {
                    angular.forEach($scope.errorsMap, function(msg, key) {
                        var fieldName = key + "";
                        var message = msg + "";
                        if (fieldName != "blueprintReferenceId" || !$scope.scoringRule.blueprintReferenceType || $scope.scoringRule.blueprintReferenceType != "Assessment") {
                            $scope.editableForm.$setError(fieldName, message);
                        }
                    });
                    return "Error";
                }
            });
        };

        $scope.toggleEditor = function() {
            $scope.editScoringRule = !$scope.editScoringRule;
            $scope.formAction = $scope.editScoringRule ? 'Edit' : 'View';
            $scope.sortableScoringRuleParamDictionaryOptions.disabled = !$scope.editScoringRule;
        };
        
        $scope.openEditor = function() {
            $scope.toggleEditor();
            focus('focusEdit');
            $scope.originalScoringRule = angular.copy($scope.scoringRule);
            $scope.editableForm.$show();
        };

        $scope.cancelEditor = function() {
            $scope.errors = [];
            $scope.messages = {};
            $scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
            $scope.scoringRule = angular.copy($scope.originalScoringRule);
            $scope.loadReferenceNames(false, $scope.scoringRule.blueprintReferenceType);
        	$scope.loadDenotationChoice(false, $scope.scoringRule.blueprintDenotationType);
            $scope.loadComputationRuleChoice(false, $scope.scoringRule.computationRuleId);
            $scope.queue = [], $scope.fileIdsToDelete = [];
            $scope.uploadMessage = null;
            $scope.valueInQueue = false, $scope.standardErrorInQueue = false;
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
            return $scope.hasFieldError('parameters[' + index + ']');
        };

        $scope.hasGridFieldError = function(index, fieldName) {
            return $scope.hasFieldError('parameters[' + index + '].' + fieldName);
        };

        $scope.hasDictionaryFieldError = function(parentIndex, index, fieldName) {
            return $scope.hasFieldError('parameters[' + parentIndex + '].dictionaryValue[' + index + '].' + fieldName);
        };
        
        $scope.fieldErrorText = function(fieldName) {
            var messageMap = $scope.messages;
            var fieldMap = messageMap ? messageMap[fieldName] : null;
            return fieldMap ? fieldMap.join('\n') : '';
        };

        $scope.returnToSearch = function() {
            $state.transitionTo("assessmenthome.scoringrule", {assessmentId:$scope.assessment.id});
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
        if ($scope.scoringRule && $scope.scoringRule.id) {
            $scope.loadReferenceNames(false, $scope.scoringRule.blueprintReferenceType);
        	$scope.loadDenotationChoice(false, $scope.scoringRule.blueprintDenotationType);
            $scope.loadComputationRuleChoice(false, $scope.scoringRule.computationRuleId);
            $scope.formAction = 'View';
            $scope.editScoringRule = false;
            $scope.isNew = false;
        } else {
            $scope.scoringRule.parameters = [];
            $scope.scoringRule.order = $scope.scoringRuleList.length + 1;
            focus('focusEdit');
            $scope.isNew = true;
            $scope.sortableScoringRuleParamDictionaryOptions.disabled = false;
        }
}]);
