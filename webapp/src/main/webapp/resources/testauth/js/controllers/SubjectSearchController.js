testauth.controller('SubjectSearchController', ['$scope', '$state', 'SubjectService', 'AssessmentService',
     function SubjectSearchController($scope, $state, SubjectService, AssessmentService) {
		if (!$state.current.searchParams) {
			$scope.searchParams = {"name":"", "type":"", "sortKey":"name", "sortDir":"asc", "currentPage": 1, "pageSize":10};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};
  		
  		$scope.inactiveItems = [
  		    { key: false, label: 'Active' },
            { key: true, label: 'Inactive' }
        ];
  		
  		$scope.searchSubjects = function(params) {
  			return SubjectService.search(params);
  		};

  		$scope.postProcessSubjects = function(subject) {
            var subjectSearchParams = {"subjectId" : subject.id, "tenantId" : subject.tenantId };
      		AssessmentService.search(subjectSearchParams).then( function(response) {
      			subject.inUse = response.data.totalCount > 0;
      		});
  		};
  		$scope.createNewSubject = function(){
            var params = {};
            angular.copy($scope.searchParams, params);
            params.subjectId = "";
            $state.transitionTo("subjectForm", params);
        };

  		$scope.edit = function(subject) {
  			$state.transitionTo("subjectForm", {subjectId:subject.id, formAction: 'Edit'});
  		};

		$scope.view = function(subject) {
			$state.transitionTo("subjectForm", { subjectId : subject.id, formAction: 'View'});
		};
		
		$scope.resetTenant = function(){
            $scope.searchParams.tenantId = null;
        };
		
		$scope.changeTenant = function(newTenant) {
            if (newTenant) {
                $scope.searchParams.tenantId = newTenant.id;
            } else {
                $scope.searchParams.tenantId = null;
            }
        };
		
        $scope.retireSubject = function(subject, undoRetirement) {
            if (undoRetirement || confirm("Would you like to retire this subject?")) {
                SubjectService.retireSubject(subject.id, undoRetirement).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-subject-search');
                    }
                });
            }
        };
		
     }]);