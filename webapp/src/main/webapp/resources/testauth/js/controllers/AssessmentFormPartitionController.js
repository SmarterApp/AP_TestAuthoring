testauth.controller('AssessmentFormPartitionController',['$scope','$state', 'loadedData', 'loadedFormList', 'FormPartitionService',
    function($scope, $state, loadedData, loadedFormList, FormPartitionService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
		$scope.formList = loadedFormList.data.searchResults;

		if (!$state.current.searchParams) {
            $scope.searchParams = {"currentPage": 1, "pageSize":"50"};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchFormPartitions = function(params) {
        	params.assessmentId = $scope.assessment.id;
            return FormPartitionService.search(params);
        };
        
        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.formId = $scope.searchParams.formId;
            params.formPartitionId = "";
            $state.transitionTo("assessmenthome.formhome.partitionedit", params);
        };

        $scope.view = function(formPartition) {
            $state.transitionTo("assessmenthome.formhome.partitionedit", {assessmentId:$scope.assessment.id, formId:formPartition.formId, formPartitionId:formPartition.id});
        };

        $scope.remove = function(formPartition) {
            if (confirm("Are you sure you want to delete this form partition?")) {
                FormPartitionService.remove(formPartition).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-formpartition-search');
                    }
                });
            };
        };
	}
]);

