testauth.controller('ComputationRuleFormController',['$scope','$state', 'loadedData', 'ComputationRuleService', 'focus',
    function($scope, $state, loadedData, ComputationRuleService, focus) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.computationRule = loadedData.data;
		$scope.editComputationRule = true;
		$scope.booleanOptions = {"true":"TRUE","false":"FALSE"};

		$scope.actionButton = '';
		$scope.formAction = 'Add';
		if ($scope.computationRule && $scope.computationRule.id) {
			$scope.formAction = 'View';
			$scope.editComputationRule = false;
			$scope.isNew = false;
		} else {
			$scope.isNew = true;
		}
		
		$scope.sortableComputationRuleParamOptions = {
			disabled: true,
			update: function(e, ui) {
				$scope.editableForm.$setDirty();
			}
		};
		
		ComputationRuleService.getComputationRuleTypes().then(function(response) {
		    $scope.availableComputationRuleTypes = response.data;
		});
		
		ComputationRuleService.getConversionTableTypes().then(function(response) {
		    $scope.availableConversionTableTypes = response.data;
		});

		ComputationRuleService.getComputationRuleMultiplicityTypes().then(function(response) {
		    $scope.availableComputationRuleMultiplicityTypes = response.data;
		});

		ComputationRuleService.getDictionaryIndexTypes().then(function(response) {
		    $scope.availableDictionaryIndexTypes = response.data;
		});

		$scope.refreshComputationRuleParameter = function(index) {
			var data = $scope.computationRule.parameters[index]["computationRuleType"];
			if (data != 'Float' && data != 'Integer') {
				$scope.computationRule.parameters[index].minimumValue = "";
				$scope.computationRule.parameters[index].maximumValue = "";
			}
		};

		$scope.refreshComputationRuleMultiplicity = function(index) {
			var data = $scope.computationRule.parameters[index]["computationRuleMultiplicityType"];
			if (data != 'Dictionary') {
				$scope.computationRule.parameters[index].dictionaryIndexType = null;
			}
		};

		$scope.save = function() {
			$scope.savingIndicator = true;
			rank = 1;
			angular.forEach($scope.computationRule.parameters, function(param) {
				param.position = rank++;
			});
			return ComputationRuleService.save($scope.computationRule).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				$scope.messages = response.messages;
				if ($scope.errors.length == 0) {
					$scope.editableForm.$setPristine();
					$scope.computationRule = response.data;
			        $scope.toggleEditor();
			        $scope.isNew = false;
					$scope.computationRule.canEdit = true;
					$state.transitionTo("computationRuleForm", {computationRuleId:$scope.computationRule.id });
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

        $scope.removeItem = function (index) {
			$scope.editableForm.$setDirty();
			$scope.computationRule.parameters.splice(index,1);
		};
		
		$scope.addItem = function() {
			$scope.editableForm.$setDirty();
			if (!$scope.computationRule.parameters) {
				$scope.computationRule.parameters = [];
			}
			$scope.computationRule.parameters.push({
				"parameterName" : "",
				"computationRuleType" : null,
				"defaultValue" : "",
				"minimumValue" : "",
				"maximumValue" : "",
				"computationRuleMultiplicityType" : null,
				"dictionaryIndexType" : null,
				"position" : $scope.computationRule.parameters.length + 1
			});
			focus('focusNewParam');
		};
        
        $scope.toggleEditor = function() {
            $scope.editComputationRule = !$scope.editComputationRule;
            $scope.formAction = $scope.editComputationRule ? 'Edit' : 'View';
            $scope.sortableComputationRuleParamOptions.disabled = !$scope.editComputationRule;
		};
        
        $scope.openEditor = function() {
        	$scope.toggleEditor();
			focus('focusEdit');
            $scope.originalComputationRule = angular.copy($scope.computationRule);
            $scope.editableForm.$show();
        };

        $scope.cancelEditor = function() {
            $scope.errors = [];
            $scope.errorsMap = {};
			$scope.messages = {};
			$scope.editableForm.$setPristine();
			$scope.editableForm.$cancel();
            $scope.computationRule = angular.copy($scope.originalComputationRule);
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

        $scope.fieldErrorText = function(fieldName) {
            var messageMap = $scope.messages;
            var fieldMap = messageMap ? messageMap[fieldName] : null;
            return fieldMap ? fieldMap.join('\n') : '';
        };

        $scope.returnToSearch = function() {
        	$scope.cancelEditor();
			$state.transitionTo("computationRuleSearch");
        };

  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    		if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
    			if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
    				event.preventDefault();
    			}
	    	}
  		});
	}]);
