testauth.controller('AssessmentFormController',['$scope','$state', 'loadedData', 'loadedLanguages', 'FormService',
    function($scope, $state, loadedData, loadedLanguages, FormService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
        $scope.languageMap = loadedLanguages.data;
        $scope.languages = [];

		if (!$state.current.searchParams) {
            $scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "currentPage": 1, "pageSize":"50"};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchForms = function(params) {
            return FormService.search(params);
        };
        
        for (languageKey in $scope.languageMap) {
			if ($scope.languageMap.hasOwnProperty(languageKey)) {
    			$scope.languages.push({id : languageKey, text : $scope.languageMap[languageKey] + ' (' + languageKey.toUpperCase() + ')'});
			}
		}

        $scope.formatLanguage = function(language) {
        	for (var i = 0; i < $scope.languages.length; i++) {
				var formattedLanguage = $scope.languages[i];
				if (formattedLanguage.id == language) {
					return formattedLanguage.text;
				}
			}
        };
        
        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.formId = "";
            $state.transitionTo("assessmenthome.formhome.formedit", params);
        };

        $scope.view = function(form) {
            $state.transitionTo("assessmenthome.formhome.formedit", {assessmentId:$scope.assessment.id, formId:form.id});
        };
        
        $scope.viewPartitions = function(form) {
            $state.transitionTo("assessmenthome.formhome.partitionsearch", {assessmentId:$scope.assessment.id, formId:form.id});
        };
        
        $scope.editPartition = function(formPartition) {
            $state.transitionTo("assessmenthome.formhome.partitionedit", {assessmentId:$scope.assessment.id, formPartitionId:formPartition.id});
        };
        
        $scope.remove = function(form) {
            if (confirm("Are you sure you want to delete this form?")) {
                FormService.remove(form).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-form-search');
                    }
                });
            };
        };
	}
]);

