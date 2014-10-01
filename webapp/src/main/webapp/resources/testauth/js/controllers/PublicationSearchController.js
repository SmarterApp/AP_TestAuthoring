
testauth.controller('PublicationSearchController', ['$scope', '$state', 'PublicationService', 'SubjectService', 'AssessmentService',
     function PublicationSearchController($scope, $state, PublicationService, SubjectService, AssessmentService ) {
		if(!$state.current.searchParams) {
			$scope.searchParams = {"name":"", "type":"", "sortKey":"coreStandardsPublicationKey", "sortDir":"asc", "currentPage": 1, "pageSize":10};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};

  		$scope.searchPublications = function(params) {
  			return PublicationService.search(params);
  		};

  		$scope.subjects = [];

        var subjectDropdownParams = { "pageSize":"500", "sortKey":"name", "inactive":false };
        SubjectService.search(subjectDropdownParams).then(function(response) {
            $scope.subjects = response.data.searchResults;
        });

        $scope.subjectDisplay = function(subjectList) {
            var subjectNames = $.map( subjectList, function(subject) { return subject.name; } );
            return subjectNames.sort().join(", ");
        };

  		$scope.createNewPublication = function() {
  			var params = {};
  			angular.copy($scope.searchParams, params);
  			params.publicationId = "";
  			$state.transitionTo("publicationform", params);
  		};

		$scope.view = function(publication) {
			$state.transitionTo("publicationform", { publicationId : publication.id });
		};  		

  		$scope.remove = function(publication) {          
            if(confirm("Are you sure you want to delete this publication?")){
                PublicationService.remove(publication).then( function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-publication-search');
                    }
                });
            };
        };
     }]);