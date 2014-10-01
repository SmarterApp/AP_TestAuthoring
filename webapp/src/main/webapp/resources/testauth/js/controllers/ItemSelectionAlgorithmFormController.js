
testauth.controller('ItemSelectionAlgorithmFormController', [ '$scope', '$state', 'loadedData', 'ItemSelectionAlgorithmService',
	function($scope, $state, loadedData, ItemSelectionAlgorithmService) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
		$scope.errorsMap = {};
		$scope.formAction = 'View';
		$scope.itemSelectionAlgorithm = loadedData.data;
		$scope.addingItem = false;

		if ($scope.itemSelectionAlgorithm && $scope.itemSelectionAlgorithm.id) {
			$scope.isNew = false;
			$scope.copyform = $scope.editableForm;
		} else {
			$scope.isNew = true;
			$scope.formAction = 'Add';
		}

		$scope.loadConditionalFields = function(algorithm) {
		    if (algorithm.parameters) {
    	        algorithm.parameters = $.map(algorithm.parameters,function(parameter) {
        		    parameter.listDefaultValue = null;
        		    parameter.numberDefaultValue = null;
        		    parameter.booleanDefaultValue = 'false';
        		    if (parameter.itemSelectionType == 'List') {
        		        parameter.listDefaultValue = parameter.defaultValue;
        		    } else if (parameter.itemSelectionType == 'Integer' || parameter.itemSelectionType == 'Float') {
        		        parameter.numberDefaultValue = parameter.defaultValue;
        		    } else if (parameter.itemSelectionType == 'Boolean') {
        		        parameter.booleanDefaultValue = parameter.defaultValue;
        		    } else if (parameter.itemSelectionType == "String") {
        		    	parameter.stringDefaultValue = parameter.defaultValue;
        		    }
        		    return parameter;
    	        });
		    }
		};
		$scope.loadConditionalFields($scope.itemSelectionAlgorithm);
		
		$scope.applyConditionalFields = function(algorithm) {
		    if (algorithm.parameters) {
    		    algorithm.parameters = $.map(algorithm.parameters,function(parameter,index) {
        		    if (parameter.itemSelectionType == 'List') {
                        parameter.defaultValue = parameter.listDefaultValue;
                        parameter.minimumValue = "";
                        parameter.maximumValue = "";
                        if(parameter.itemSelectionList) {
                        parameter.itemSelectionList = $.map(parameter.itemSelectionList, function(element,index2) {
                            element.position = index2 + 1;
                            return element;
                        });
                        }
                    } else if (parameter.itemSelectionType == 'Integer' || parameter.itemSelectionType == 'Float') {
                        parameter.defaultValue = parameter.numberDefaultValue;
                    } else if (parameter.itemSelectionType == 'Boolean') {
                        parameter.defaultValue = parameter.booleanDefaultValue;
                        parameter.minimumValue = "";
                        parameter.maximumValue = "";
                    } else if (parameter.itemSelectionType = "String") {
                        parameter.defaultValue = parameter.stringDefaultValue;
                        parameter.minimumValue = "";
                        parameter.maximumValue = "";
                    }
        		    parameter.position = index + 1;
        		    return parameter;
    		    });
		    }
		};

		$scope.sortParamListActive = false;
		$scope.paramSortingActive = false;
		$scope.actionButton = '';
		
		$scope.activateTab = function(index){
			if($scope.itemSelectionAlgorithm.parameters && $scope.itemSelectionAlgorithm.parameters[index]){
				$scope.itemSelectionAlgorithm.parameters[index].active = true;
			}
		};
		
		$scope.activateTab(0);
		
		ItemSelectionAlgorithmService.getItemSelectionAlgorithmTypes().then(
			function(response) {
				$scope.availableItemSelectionAlgorithmTypes = response.data;
			});

		ItemSelectionAlgorithmService.getItemSelectionPurposes().then(
			function(response) {
				$scope.availableItemSelectionPurposes = response.data;
			});

		ItemSelectionAlgorithmService.getItemSelectionTypes().then(
			function(response) {
				$scope.availableItemSelectionTypes = response.data;
			});

		$scope.sortableParamListOptions = {
			update: function(e, ui) {
				$scope.editableForm.$dirty = true;
				var $list = ui.item.parent();
				position = 1;
				$scope.$apply(function() {
					angular.forEach($list, function(listItem) {
						listItem.position = position++;
					});
				});
			}
		};
		
		$scope.save = function() {
			$scope.stopSortingParamList();
			$scope.savingIndicator = true;
			$scope.applyConditionalFields($scope.itemSelectionAlgorithm);
			return	ItemSelectionAlgorithmService.save($scope.itemSelectionAlgorithm).then(
					function(response) {
						var rval = "error";
						$scope.savingIndicator = false;
						$scope.errors = response.errors;
						$scope.errorsMap = response.messages;
						if ($scope.errors.length == 0) {
							$scope.editableForm.$setPristine();
							$scope.itemSelectionAlgorithm = response.data;
				            $scope.loadConditionalFields($scope.itemSelectionAlgorithm);
							$scope.activateTab(0);
							rval = true;
							$scope.isNew = false;
							$scope.itemSelectionAlgorithm.canEdit = true;
							$state.transitionTo("itemSelectionAlgorithmForm", { itemSelectionAlgorithmId : $scope.itemSelectionAlgorithm.id });
						}else{
							angular.forEach($scope.errorsMap, function(msg,key){
								var fieldName = key + "";
								var message = msg + "";
								$scope.editableForm.$setError(fieldName, message);	
							});
						}
						return rval;
					});
		};
		
		$scope.hasTabErrord = true;
		$scope.hasTabError = function(index){
			var error = false;
			angular.forEach($scope.errorsMap, function(msg,key){
				var fieldName = key + "";
				if(fieldName.indexOf('parameters['+index+']') > -1){
					error = true;
				}
			});
			return  error;
		};
		
		$scope.sortParams = function() {
			$scope.paramSortingActive = true;
		};
		
		$scope.stopSorting = function() {
			$scope.paramSortingActive = false;
			$scope.addingItem = false;
		};

		$scope.removeParam = function(index) {
			$scope.itemSelectionAlgorithm.parameters.splice(index, 1);
			$scope.editableForm.$dirty = true;
			$scope.addingItem = false;
		};

		$scope.addItem = function() {
			if (!$scope.itemSelectionAlgorithm.parameters) {
				$scope.itemSelectionAlgorithm.parameters = [];
			}
			$scope.itemSelectionAlgorithm.parameters.push({
				"parameterName" : "New Parameter",
				"description" : "",
				"itemSelectionPurpose" : null,
				"defaultValue" : "",
				"minimumValue" : "",
				"maximumValue" : "",
				"itemSelectionType" : null,
				"itemSelectionList" : null,
				"position" : $scope.itemSelectionAlgorithm.parameters.length + 1,
				"booleanDefaultValue": "false"
			});
			$scope.activateTab($scope.itemSelectionAlgorithm.parameters.length -1);
			$scope.editableForm.$dirty = true;
			$scope.addingItem = true;
			$scope.stopSortingParamList();
		};

		
		$scope.sortParamList = function(paramIndex) {
			//jquery to reindex the form fields from the array data (there can be gaps if one is deleted)
			$("input[name^='parameters[" + paramIndex + "].itemSelectionList']").each(function(index, field) {
		        var replacename = "parameters[" + paramIndex +"].itemSelectionList[" + index + "].name";
		        $(field).attr("name", replacename);
		    });
			//set the values on the model from the form values
			for (var i = 0; i < $scope.itemSelectionAlgorithm.parameters[paramIndex].itemSelectionList.length; i++) {
				$scope.itemSelectionAlgorithm.parameters[paramIndex].itemSelectionList[i].name = $("input[name='parameters[" + paramIndex + "].itemSelectionList[" + i + "].name']").val();
			}
			$scope.sortParamListActive = true;
		};

		$scope.stopSortingParamList = function(){
			$scope.sortParamListActive = false;
		};


		$scope.changeDefaultValue = function(index, data){
			$scope.itemSelectionAlgorithm.parameters[index]["defaultValue"] = data;
		};
		
		$scope.refreshItemSelectionParameter = function(param, index, data) {
			$scope.itemSelectionAlgorithm.parameters[index]["itemSelectionType"] = data;
			if (data != 'List') {
				param.itemSelectionList = [];
			}
			if (data == 'List' || data == 'Boolean') {
				param.defaultValue = "";
				param.minimumValue = "";
				param.maximumValue = "";
			}
		};
		
		$scope.getParamModelValue = function (index, fieldName){
			var value = $scope.itemSelectionAlgorithm.parameters[index][fieldName];
			
            if($scope.editableForm.$visible && $scope.addingItem && $scope.editableForm['parameters[' +index + '].'+fieldName]){
            	value = $scope.editableForm['parameters[' +index + '].'+fieldName].$viewValue;
            }
            
            return value;
		};
		
		$scope.shouldDisplayBooleanFields = function($index) {
		    var value = $scope.itemSelectionAlgorithm.parameters[$index].itemSelectionType;
            return value == 'Boolean';
        };
		
		$scope.shouldDisplayNumberRestrictions = function($index) {
			var value = $scope.itemSelectionAlgorithm.parameters[$index].itemSelectionType;
			return value == 'Float' || value == 'Integer';
		};
		
		$scope.shouldDisplayListValues = function($index) {
			var value = $scope.itemSelectionAlgorithm.parameters[$index].itemSelectionType;
			return value == 'List';
		};
		
		$scope.shouldDisplayStringFields = function($index) {
			var value = $scope.itemSelectionAlgorithm.parameters[$index].itemSelectionType;
			return value == 'String';
		};

		$scope.removeItemSelectionListElement = function(list, index) {
			list.splice(index, 1);
			$scope.editableForm.$dirty = true;
		};

		$scope.addItemSelectionListElement = function(itemSelectionParam) {
			if (!itemSelectionParam.itemSelectionList) {
				itemSelectionParam.itemSelectionList = [];
			}
			itemSelectionParam.itemSelectionList.push({
				"name" : "",
				"position" : itemSelectionParam.itemSelectionList.length + 1
			});
			$scope.editableForm.$dirty = true;
		};
	
		$scope.back = function() {
            $scope.actionButton = 'cancel';
            $state.transitionTo("itemSelectionAlgorithmSearch");
        };
        
        $scope.edit = function() {
    		$scope.formAction = 'Edit';
            $scope.originalItemSelectionAlgorithm = angular.copy($scope.itemSelectionAlgorithm);
            $scope.editableForm.$show();
        };
        
        $scope.cancel = function() {
            $scope.itemSelectionAlgorithm = angular.copy($scope.originalItemSelectionAlgorithm);
            if ($scope.itemSelectionAlgorithm.parameters) {
                $scope.itemSelectionAlgorithm.parameters[0].active=true;
            }
            
            $scope.errorsMap ={};
            $scope.errors ={};
    		$scope.formAction = 'View';
            $scope.editableForm.$setPristine();
            $scope.loadConditionalFields($scope.itemSelectionAlgorithm);
            $scope.itemSelectionAlgorithm.canEdit = true;
            $scope.stopSortingParamList();
            $scope.editableForm.$cancel();
        };
		
		$scope.booleanOptions = {"true":"TRUE","false":"FALSE"};

		$scope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
					if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
						event.preventDefault();
					}
				}
		});
	}
]);
