testauth.controller('AssessmentBlueprintController',['$scope','$filter','$state', '$document', 'loadedData', 'BlueprintElementService', 'CoreStandardsService', '$location','$anchorScroll', 'SegmentService',
    function($scope, $filter, $state, $document, loadedData, BlueprintElementService, CoreStandardsService, $location, $anchorScroll, SegmentService) {
        $scope.errors = loadedData.errors;
        $scope.assessment = loadedData.data;
        $scope.syncIndicator = true;
        $scope.activeElements = "?";
        $scope.searchResponse = {};
        $scope.blueprintErrorMap = {};
        
        $scope.blueprints = [];
        $scope.algorithms = [];
        $scope.blueprintErrors = [];
        $scope.showTools = true;
		$scope.showWidgets = false;
		$scope.showErrors = false;
		$scope.showConfirmation = false;
		    
		$scope.toggleWidgets = function(){
			$scope.showWidgets = !$scope.showWidgets;
			$scope.showTools = !$scope.showTools;
			$scope.showToolsFocus = $scope.showTools;
			$scope.showConfirmation = false;
			$scope.widget = {};
		};

		$scope.toggleStats = function(){
			$scope.showStats = !$scope.showStats;
			$scope.showTools = !$scope.showTools;
			$scope.showToolsFocus = $scope.showTools;
		};
		
        $scope.getDefaultSearchParams = function() {
            return {"assessmentId": $scope.assessment.id
            		, "sortKey":"grade,sortData"
            		, "sortDir":"asc", "currentPage": 1
            		, "pageSize":"25", "active":true
            		, "selectedBlueprint":"MASTER", standardKey:""};
        };
		
        $scope.toggleErrors = function(){
        	 $scope.showErrors = !$scope.showErrors;
        	 $scope.showTools = !$scope.showTools;
        	 $scope.showToolsFocus = $scope.showTools;
        };
        
        $scope.changeWidth = function(params){
        	newWidth  = 100;
    		if(params) {
    			newWidth =  100 + (15 * params.length);
    		}       
        	return {
        		width : newWidth + "%"
                
            };
        };
        
        $scope.getRelativeWidth = function(baseWidth, params) {
        	newWidth = baseWidth;
    		if(params) {
    			newTableWidth =  100 + (15 * params.length);
    			factor = 100 / newTableWidth;
    			newWidth = baseWidth * factor;
    		}       
        	return {
        		width : newWidth + "%"
                
            };
        };
       		
        if (!$state.current.searchParams) {
            $scope.searchParams = $scope.getDefaultSearchParams();
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        
        if (!$scope.assessment.locked) {
        	$scope.deactivateInitialSearch = "true";
            BlueprintElementService.synchWithCoreStandards($scope.assessment.id).then(function(response) {
    			$scope.syncIndicator = false;
    			$scope.errors = response.errors;
    			if ($scope.errors.length == 0) {
    		        $scope.updatedBlueprintElementTotal = response.data;
                    $scope.searchParams.currentPage = 1;
                    $scope.$broadcast('initiate-blueprint-search');
    			}
    		});
        } else {
        	$scope.deactivateInitialSearch = "false";
			$scope.syncIndicator = false;
        }
        
        CoreStandardsService.searchGradeByPublication({"publicationKey":$scope.assessment.publication.coreStandardsPublicationKey}).then( function(response) {
            $scope.grades = response.data.payload;
        });
        SegmentService.search({"pageSize":"1000", "assessmentId": $scope.assessment.id, "sortKey":"position"}).then( function(response) {
             $scope.blueprints = [];  $scope.segmentBlueprints = [];
             $scope.blueprints.push({'key':'MASTER', 'label':'Master'});
             $scope.algorithms = {};
             $scope.algorithms["MASTER"] = {};
        	 angular.forEach(response.data.searchResults, function(segment){
                 $scope.blueprints.push({'key':segment.id, 'label':segment.position + " - " + segment.label});
                 $scope.segmentBlueprints.push({'key':segment.id, 'label':segment.position + " - " + segment.label});
                 $scope.algorithms[segment.id] = segment.itemSelectionAlgorithm;
        	 });
             if (!$scope.assessment.locked) {
	        	 $scope.validateBlueprints();
             }
        });
        
        $scope.searchBlueprintElements = function(params) {
        	$scope.updateStats();
        	return BlueprintElementService.search(params);
        };

        $scope.updateStats = function(){
        	var activeParams = {"assessmentId": $scope.assessment.id, "active":"true",  "currentPage": 1, "pageSize":"0"};
        	BlueprintElementService.search(activeParams).then(function(response){
        		if(response.data){
        			$scope.activeElements = response.data.totalCount;
        		}else{
        			$scope.activeElements = '?';
        		}
        	});
        };
        
        $scope.disableSearch = function() {
        	$scope.disabledSearch = true;
        };
        
        $scope.openEditor = function(frm) {
            $scope.originalBlueprints= angular.copy($scope.searchResponse.searchResults);
            $scope.originalBlueprintErrorMap = angular.copy($scope.blueprintErrorMap);
            $scope.originalErrors = angular.copy($scope.errors);
            frm.$show();
            $scope.editorOpen = true;
            $scope.showToolsFocus = false;
        };
        
        $scope.clearErrors = function() {
            $scope.blueprintErrorMap = {};
            $scope.errors = [];
        };
        
        $scope.cancelEditor = function(){
            $scope.closeEditor();
            $scope.errors = $scope.originalErrors;
            $scope.blueprintErrorMap = $scope.originalBlueprintErrorMap;
            $scope.searchResponse.searchResults = $scope.originalBlueprints;
            $scope.editorOpen = false;
            $scope.showToolsFocus = true;
        };
        
        $scope.closeEditor = function() {
            $scope.clearErrors();
            $scope.disabledSearch = false;
        };
        
        $scope.saveAll = function(blueprintElements) {
			$scope.saveIndicator = true;
			
			if(blueprintElements){
			    // check if integer fields are valid (not floats)
			    $scope.clearErrors();
			    var isValid = $scope.validateIntegerFields(blueprintElements,$scope.searchParams.selectedBlueprint);
			    if (!isValid) {
                    $scope.saveIndicator = false;
                    $scope.moveToTop();
			        return "error";  // return string to cause in-line editor to remain open
			    }
			    
				return BlueprintElementService.updateCollection(blueprintElements).then(function(response) {
				    if (response.errors && response.errors.length > 0) {
				        angular.forEach(response.errors, function(error){
				        	var id = "";
				        	if(blueprintElements[error.blueprintIndex]){
				        		id = blueprintElements[error.blueprintIndex].id;
				        	}
				        	$scope.processError(error.segmentId,id,error.fieldName,error.message,true);
		                });
	                    $scope.saveIndicator = false;
	                    $scope.moveToTop();
	                    return "error"; // return string to cause in-line editor to remain open
				    } else {
				        $scope.closeEditor();
				        $scope.$broadcast('initiate-blueprint-search');
				        $scope.validateBlueprints();
				        $scope.saveIndicator = false;
	                    $scope.updateStats();
	                    
				    }
				});
			}
        };
        
        $scope.activeItems = [
            { key: true, label: 'Active' },
            { key: false, label: 'Inactive' }
        ];
        
        $scope.gradesSelector = {
            'placeholder': "Select...",
            'allowClear': true,
            'multiple': true,
            'simple_tags': true,
            'width' :'resolve',
            'query': function (query) {
                var data = { results: $scope.convertGradesToSelect2Array($scope.grades) };
                query.callback(data);
            },
            'id': function(select2Object) { // retrieve a unique id from a select2 object
                return select2Object.id;
            }
        };
        
        $scope.convertGradesToSelect2Array = function(grades) {
            return $.map( grades, function(grade) { return { "id":grade.key, "text":grade.name }; });
        };
                
        //~ START row expand/collapse logic ================================================
        $scope.collapsedElements = [];
        
        var getCollapsedIndex = function(parentElement) {
            return $scope.collapsedElements.map(function(e) { return e.id; }).indexOf(parentElement.id);
        };
        
        $scope.collapse = function(parentElement) {
            $scope.collapsedElements.push({
                "id":parentElement.id,
                "standardKey":parentElement.standardKey,
                "grade":parentElement.grade
            });
        };
                
        $scope.expand = function(parentElement) {
            var pos = getCollapsedIndex(parentElement);
            if ( pos > -1 ) {
                $scope.collapsedElements.splice(pos,1);
            }
        };
        
        $scope.isCollapsed = function(blueprintElement) {
            return getCollapsedIndex(blueprintElement) > -1;
        };
        
        // whether a given row has been hidden (equivalent to whether their parent is collapsed)
        $scope.isParentCollapsed = function(blueprintElement) { 
            return $.grep($scope.collapsedElements, function(collapsedElement) {
                var keyMatches = blueprintElement.standardKey.indexOf(collapsedElement.standardKey + "|") == 0;
                return keyMatches && angular.equals(blueprintElement.grade,collapsedElement.grade);
            }).length > 0;
        };
        
        // whether the current row has a child (equivalent to whether the next row in the table is exactly one level down)
        $scope.hasChild = function(rowIndex) {
            var currentElement = $scope.searchResponse.searchResults[rowIndex];
            var nextElement = $scope.searchResponse.searchResults[rowIndex + 1];
            return nextElement ? angular.equals(parseInt(currentElement.level) + 1,parseInt(nextElement.level)) : false;
        };
        
        $scope.hasParent = function(rowIndex) {
            var currentElement = $scope.searchResponse.searchResults[rowIndex];
            return parseInt(currentElement.level) > 1;
        };
        //~ END row expand/collapse logic ================================================
        
        $scope.moveToBottom = function(){
        	 $location.hash('bottomOfTable');
        	 $anchorScroll();
        };
        
        $scope.moveToTop = function(){
        	 $location.hash('topOfPage');
        	 $anchorScroll();
        };
        
        $scope.widget = {};
        $scope.closeWidgetWithConfirmation = function(message) {
            $scope.$broadcast('initiate-blueprint-search');
            $scope.showConfirmation = true;
            $scope.confirmationMessage = message;
            $scope.widget.saveIndicator = false;
            $scope.validateBlueprints();
        };
        
        $scope.getBlueprintName = function(segmentId) {
            return $.grep($scope.blueprints, function(bpEntry){return bpEntry.key == segmentId;})[0].label;
        };
        
        $scope.useWidget = function(){
            if ( $scope.widget.action == 'clear') {
                //~ clear segment  =================================================
                if(!$scope.widget.clearSegmentId) {
                    $scope.widget.errors = ["Segment is required."];
                } else {
                    $scope.widget.saveIndicator = true;
                    BlueprintElementService.clearBlueprint($scope.assessment.id,$scope.widget.clearSegmentId).then(function(response) {
                        $scope.closeWidgetWithConfirmation("Successfully cleared segment: " + $scope.getBlueprintName($scope.widget.clearSegmentId));
                    });
                }
            } else if ( $scope.widget.action == 'activate' || $scope.widget.action == 'deactivate') {
                //~ activate/deactivate grade ===========================================
                if ( $scope.widget.grades && $scope.widget.grades.length > 0 ) {
                    $scope.widget.saveIndicator = true;
                    var activate = $scope.widget.action == 'activate' ? true : false;
                    BlueprintElementService.activateBpElementGrades($scope.assessment.id,$scope.widget.grades,activate).then(function(response) {
                        $scope.closeWidgetWithConfirmation("Successfully " + (activate ? "activated" : "deactivated") + " grades: " + $scope.widget.grades);
                    });
                } else {
                    $scope.widget.errors = ["Grade is required."];
                }
            } else if ( $scope.widget.action == 'activateStandard' || $scope.widget.action == 'deactivateStandard') {
                //~ activate/deactivate standard ===========================================
                if ( $scope.widget.grade && $scope.widget.standardKey) {
                    $scope.widget.saveIndicator = true;
                    var activate = $scope.widget.action == 'activateStandard' ? true : false;
                    BlueprintElementService.activateBpElementStandard($scope.assessment.id,$scope.widget.grade,$scope.widget.standardKey,activate).then(function(response) {
                        $scope.closeWidgetWithConfirmation("Successfully " + (activate ? "activated" : "deactivated") + " standard: " + $scope.widget.standardKey + " (grade: " + $scope.widget.grade + ")");
                    });
                } else {
                    $scope.widget.errors = ["Grade and Standard Key are required."];
                }
            } else if ( $scope.widget.action == 'copy' ) {
                //~ copy from another segment ===========================================
                if (!$scope.widget.fromSegmentId || !$scope.widget.toSegmentId) {
                    $scope.widget.errors = [];
                    if (!$scope.widget.fromSegmentId) {
                        $scope.widget.errors.push("From Segment is required.");
                    } 
                    if (!$scope.widget.toSegmentId) {
                        $scope.widget.errors.push("To Segment is required.");
                    } 
                } else {
                    $scope.widget.saveIndicator = true;
                    BlueprintElementService.addSegmentToBlueprintElementData($scope.assessment.id,$scope.widget.toSegmentId,$scope.widget.fromSegmentId).then(function(response) {
                        $scope.closeWidgetWithConfirmation("Successfully copied blueprint from: " + $scope.getBlueprintName($scope.widget.fromSegmentId) + " to: " + $scope.getBlueprintName($scope.widget.toSegmentId));
                    });
                }
            } else {
                alert("Is this a new action?");
            }
        };
        
        $scope.updateAvailableStandards = function(grade) {
            $scope.availableStandards = [];
            $scope.widget.standardKey = null;
            CoreStandardsService.search({"hierarchy":"publication/" + $scope.assessment.publication.coreStandardsPublicationKey + "/standard", "grade": grade }).then( function(response) {
                $scope.availableStandards = response.data.payload;
            });
        };
        
        $scope.validateBlueprints = function () {
        	BlueprintElementService.getValidationResults($scope.assessment.id).then(function(response){
        		if(response != null){
        			$scope.blueprintErrors = response.data;
        		} else {
        			$scope.blueprintErrors = [];
        		}
        		$scope.blueprintErrorMap = {};
        		angular.forEach($scope.blueprintErrors, function(error){
        			if(error.validatedObject) {
        				$scope.processError(error.segmentId,error.validatedObject.id,error.fieldName,error.message,false);
        			}
           	 	});
        	});
        };
        
        var fieldsToCheck = { 
                operationalItemMinValue: "Operational Item Min", 
                operationalItemMaxValue: "Operational Item Max", 
                fieldTestItemMinValue: "Field Test Item Min", 
                fieldTestItemMaxValue: "Field Test Item Max"
        };
        
        $scope.validateIntegerFields = function(blueprintElements,segmentId) {
            var isValid = true;
            angular.forEach(blueprintElements, function(bpElement) {
                var bpElementValue = bpElement.blueprintElementValueMap[segmentId];
                
                angular.forEach(fieldsToCheck, function(label,field) {
                    var data = bpElementValue[field];
                    if (!data && data != "0") {
                        $scope.processError(segmentId,bpElement.id,field,label + " value is required",true);
                        isValid = false;
                    } else if ( (data.toString().indexOf('.') > -1) || (data >>> 0 !== parseFloat(data))) {
                        $scope.processError(segmentId,bpElement.id,field,label + " value must be a positive integer",true);
                        isValid = false;
                    }
                });
            });
            
            return isValid;
        };
        
        var initializeField = function(jsonObject,fieldName,defaultValue) {
            if (jsonObject[fieldName] == null) {
                jsonObject[fieldName] = defaultValue;
            }
        };
        
        /*
         * $scope.blueprintErrorMap = {
         *     segmentId: {
         *         blueprintElementId: {
         *             fieldName1: [
         *                 {isSevere: true, message: "errorMesssage1"},
         *                 {isSevere: false, message: "errorMessage2"}
         *             ],
         *             fieldName2: [...]
         *         }
         *     }
         * }
         */
        $scope.processError = function(segmentId,bpElementId,fieldName,errorMessage,isSevere) {
            if (segmentId) {
                initializeField($scope.blueprintErrorMap,segmentId,{});
                initializeField($scope.blueprintErrorMap[segmentId],bpElementId,{});
                initializeField($scope.blueprintErrorMap[segmentId][bpElementId],fieldName,[]);
                
                $scope.blueprintErrorMap[segmentId][bpElementId][fieldName].push( {'message':errorMessage, 'isSevere':isSevere} );
            }
            
            if (isSevere) {
                initializeField($scope,"errors",[]);
                $scope.errors.push(errorMessage);
            }
        };

        $scope.getParamsForErrorFiltering = function(bpError){
        	return {
        	    "selectedBlueprint" : bpError.segmentId,
        	    "assessmentId":bpError.validatedObject.assessmentId, 
        	    "grade": bpError.validatedObject.grade,
        	    "standardKey" :bpError.validatedObject.standardKey,
        	    "pageSize" : 50,
        	    "active" : bpError.validatedObject.active
            };
        };
        
        $scope.hasRowError = function(blueprintElement) {
            var segmentMap = $scope.blueprintErrorMap[$scope.searchParams.selectedBlueprint];
            return segmentMap ? segmentMap[blueprintElement.id] : false;
        };        
        
        $scope.hasValidationError = function(blueprintElement, fieldName) {
            var segmentMap = $scope.blueprintErrorMap[$scope.searchParams.selectedBlueprint];
            var bpElementMap = segmentMap ? segmentMap[blueprintElement.id] : null;
            var fieldMap = bpElementMap ? bpElementMap[fieldName] : null;
            return fieldMap ? $.grep(fieldMap, function(msgObject){return msgObject.isSevere == false;}).length > 0 : false;
        };
        
        $scope.hasSevereError = function(blueprintElement, fieldName) {
            var segmentMap = $scope.blueprintErrorMap[$scope.searchParams.selectedBlueprint];
            var bpElementMap = segmentMap ? segmentMap[blueprintElement.id] : null;
            var fieldMap = bpElementMap ? bpElementMap[fieldName] : null;
            return fieldMap ? $.grep(fieldMap, function(msgObject){return msgObject.isSevere == true;}).length > 0 : false;
        };
        
        $scope.fieldErrorText = function(blueprintElement, fieldName) {
            var segmentMap = $scope.blueprintErrorMap[$scope.searchParams.selectedBlueprint];
            var bpElementMap = segmentMap ? segmentMap[blueprintElement.id] : null;
            var fieldMap = bpElementMap ? bpElementMap[fieldName] : null;
            return fieldMap ? $.map(fieldMap, function(msgObject){return msgObject.message;}).join('\n') : '';
        };
        
        $scope.getBlueprintElementValue = function(blueprintElement, segmentId) {
            return (segmentId == 'MASTER') ? blueprintElement.masterValue : blueprintElement.blueprintElementValueMap[segmentId];
        };
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        	if ($scope.disabledSearch) {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
    }
]);

