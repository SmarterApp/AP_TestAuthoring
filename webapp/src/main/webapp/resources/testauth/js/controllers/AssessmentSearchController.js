testauth.controller('AssessmentSearchController', ['$scope', '$state', 'loadedGrades', 'loadedAssessmentTypes', 'loadedAssessmentStatuses', 'AssessmentService', 'CurrentUserService', 'SubjectService',
     function AssessmentSearchController($scope, $state, loadedGrades, loadedAssessmentTypes, loadedAssessmentStatuses, AssessmentService, CurrentUserService, SubjectService) {
	
		$scope.updateIndicator = false;
        
		if(!$state.current.searchParams) {
			$scope.searchParams = {"name":"", "type":"", "sortKey":"name", "sortDir":"asc", "currentPage": 1, "pageSize":25};
		}else{
			$scope.searchParams = $state.current.searchParams;
		}
		
		$scope.searchResponse = {};
        $scope.availableGrades = loadedGrades.data.payload;
        $scope.availableTypes = loadedAssessmentTypes.data;
        $scope.availableStatuses = loadedAssessmentStatuses.data;
        
        var subjectSearchParams = { "pageSize":"500", "sortKey":"name", "tenantId": CurrentUserService.getTenantId(), "inactive":false};
        SubjectService.search(subjectSearchParams).then(function(response) {
            $scope.availableSubjects = response.data.searchResults;
        });
        
		$scope.searchTests = function(params){
  			params.tenantId = CurrentUserService.getTenantId();
  			return AssessmentService.search(params);
  		};

  		$scope.createNewItem = function(){
  			var params = {};
  			angular.copy($scope.searchParams, params);
  			params.assessmentId = "";
  			AssessmentService.removeCache();
  			$state.transitionTo("assessmenthome.detailhome.edit", params);
  		};
  		
  		$scope.edit = function(assessment) {
  			$state.transitionTo("assessmenthome.detailhome.edit", {assessmentId:assessment.id});
  		};        

        $scope.copy = function(assessment) {          
            if(confirm("Are you sure you want to copy this assessment?")){
            	$scope.updateIndicator = true;
                AssessmentService.copy(assessment.id).then( function(response) {
                    $scope.errors = response.errors;
                    $scope.updateIndicator = false;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-assessment-search');
              			$scope.edit(response.data);
                    }
                });
            };
        };

        $scope.remove = function(assessment) {          
            if(confirm("Are you sure you want to delete this assessment?")){
            	$scope.updateIndicator = true;
                AssessmentService.remove(assessment).then( function(response) {
                    $scope.errors = response.errors;
                    $scope.updateIndicator = false;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-assessment-search');
                    }
                });
            };
        };
        
        //~ START Grades Selection ---------------------------------------
        $scope.gradesSelector = {
                'placeholder': "Select...",
                'allowClear': true,
                'multiple': true,
                'simple_tags': true,
                'width' :'resolve',
                'query': function (query) {
                    var data = { results: $scope.convertGradesToSelect2Array($scope.availableGrades) };
                    query.callback(data);
                },
                'id': function(select2Object) {  // retrieve a unique id from a select2 object
                    return select2Object.id; 
                },
                'setPristine': false
        };
        
        $scope.convertGradesToSelect2Array = function(grades) {
            return $.map( grades, function(grade) { return { "id":grade.key, "text":grade.name }; });
        };
        //~ END Grades Selection ---------------------------------------
        
     }]);