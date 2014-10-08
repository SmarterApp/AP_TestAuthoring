testauth.controller('AssessmentFormEditController',['$scope','$state', 'loadedData', 'loadedForm', 'loadedLanguages', 'FormService', 'focus', 
    function($scope, $state, loadedData, loadedForm, loadedLanguages, FormService, focus) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.form = loadedForm.data;
		$scope.editForm = true;
        $scope.form.assessmentId = $scope.assessment.id;
        $scope.languageList = loadedLanguages;
		$scope.languages = [];

		for (var i = 0; i < $scope.languageList.length; i++) {
			$scope.languages.push({id : $scope.languageList[i].id, text : $scope.languageList[i].metadataValue});
		}

        $scope.convertLanguagesToSelect2Array = function(languages) {
        	return $.map( languages, function(language) { return { "id":language.id, "text":language.text }; });
        };

        $scope.convertLanguagesToString = function(languages) {
        	return $.map( languages, function(language) { return { "id":language, "text":""}; });
        };

        $scope.save = function() {
        	$scope.savingIndicator = true;
			
        	return FormService.save($scope.form).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.messages = response.messages;
				$scope.errorsMap = response.messages;
				if ($scope.errors.length == 0) {
					$scope.editableForm.$setPristine();
					$scope.form = response.data;
					$scope.toggleEditor();
					$scope.isNew = false;
					$state.transitionTo("assessmenthome.formhome.formedit", {assessmentId:$scope.assessment.id, formId:$scope.form.id});
				} else {
					angular.forEach($scope.errorsMap, function(msg,key) {
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
            $scope.editForm = !$scope.editForm;
            $scope.formAction = $scope.editForm ? 'Edit' : 'View';
		};

        $scope.back = function() {
            $scope.actionButton = 'cancel';
            $state.transitionTo("assessmenthome.formhome.formsearch", {assessmentId:$scope.assessment.id});
        };
        
        $scope.edit = function() {
        	$scope.toggleEditor();
			focus('focusEdit');
            $scope.originalFormData = angular.copy($scope.form);
            $scope.editableForm.$show();
        };
        
        $scope.cancel = function() {
            $scope.errors = [];
			$scope.messages = {};
			$scope.form = angular.copy($scope.originalFormData);
			$(".select2-chosen").text($scope.originalFormData.language);
//            $scope.editableForm.language.$setViewValue($scope.originalFormData.language);
            $scope.editableForm.$cancel();
            $scope.editableForm.$setPristine();
        	$scope.toggleEditor();
        };

        $scope.returnToSearch = function() {
        	$scope.cancelEditor();
			$state.transitionTo("assessmenthome.formhome.formsearch", {assessmentId:$scope.assessment.id});
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
        if ($scope.form && $scope.form.id) {
    		$scope.editForm = false;
            $scope.formAction = 'Edit';
            $scope.isNew = false;
        } else {
			focus('focusEdit');
			$scope.form.language = 'eng';
			$scope.isNew = true;
        }

}]);
