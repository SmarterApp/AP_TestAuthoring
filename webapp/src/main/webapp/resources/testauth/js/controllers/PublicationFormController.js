testauth.controller('PublicationFormController',['$scope','$state', 'loadedData', 'PublicationService', 'SubjectService', 'CoreStandardsService', 'AssessmentService',
    function($scope, $state, loadedData, PublicationService, SubjectService, CoreStandardsService, AssessmentService) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
        $scope.publication = loadedData.data;
		$scope.actionButton = '';
        $scope.formAction = 'Add';
        $scope.subjects = [];
        $scope.selectedSubjects = [];
        $scope.displayDeletedSubjectMessage = false;
        
        //~ START setup utility methods =======================================
        $scope.convertSubjectsToSelect2Array = function(subjects) {
            return $.map( subjects, function(subject) { return { "id":subject, "text":subject.name }; });
        };

        $scope.loadCsSubjects = function(clearSelection) {    
            if ( clearSelection ) {
                $scope.publication.coreStandardsSubjectKey = null;
                $scope.editableForm.coreStandardsSubjectKey.$setViewValue(null);
            }
            
            if ($scope.publication.coreStandardsPublisherKey) {
                var subjectParams = { "hierarchy":"subject", "publisher":$scope.publication.coreStandardsPublisherKey };
                CoreStandardsService.search(subjectParams).then( function(response) {
                    $scope.coreStandardSubjects = response.data.payload;
                });
            } else {
                $scope.coreStandardSubjects = [];
            }
        };
        
        $scope.loadCsPublications = function(clearSelection) {        
            if ( clearSelection ) {
                $scope.publication.coreStandardsPublicationKey = null;
                $scope.editableForm.coreStandardsPublicationKey.$setViewValue(null);
            }
            
            if ($scope.publication.coreStandardsPublisherKey && $scope.publication.coreStandardsSubjectKey) {
                var publicationParams = { "hierarchy":"publication", "publisher":$scope.publication.coreStandardsPublisherKey, "subject":$scope.publication.coreStandardsSubjectKey };
                CoreStandardsService.search(publicationParams).then( function(response) {
                    $scope.coreStandardPublications = response.data.payload;
                });
            } else {
                $scope.coreStandardPublications = [];
            }
        };
        //~ END setup utility methods =======================================
				
		if ($scope.publication && $scope.publication.id) {
			$scope.formAction = 'View';
			$scope.isNew = false;
            $scope.selectedSubjects = $scope.convertSubjectsToSelect2Array($scope.publication.subjects);
            angular.forEach($scope.selectedSubjects, function(select2Object){
                if (select2Object.id.inactive) {
                    select2Object.text = "**" + select2Object.text;
                    $scope.displayDeletedSubjectMessage = true;
                }
            });
            
            $scope.selectedTenantName = $scope.publication.tenantName;
			
            var pubSearchParams = {"publicationId" : $scope.publication.id, "tenantId" : $scope.publication.tenantId };
      		AssessmentService.search(pubSearchParams).then( function(response) {
      			$scope.publicationInUse = response.data.searchResults.length > 0;
      		});

      		$scope.loadCsSubjects(false);
            $scope.loadCsPublications(false);
		}else{
			$scope.isNew = true;
		}

		$scope.resetTenant = function(){
			$scope.publication.tenantId = null;
		};
		
		$scope.save = function(){
			$scope.savingIndicator = true;
			$scope.publication.subjectIds = $.map( $scope.selectedSubjects, function(select2Object) { return select2Object.id.id; } );
			
			return PublicationService.save($scope.publication).then(function(response){
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				if ($scope.errors.length == 0) {
					$scope.editableForm.$setPristine();
					$scope.publication = response.data;
					$scope.isNew = false;
					$state.transitionTo("publicationform", { publicationId : $scope.publication.id });
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
		
		$scope.back = function() {
            $scope.actionButton = 'cancel';
            $state.transitionTo("publicationsearch");
        };
        
        $scope.cancel = function() {
			$scope.formAction = 'View';
			$scope.errors = [];
			$scope.errorsMap = {};
            $scope.publication = angular.copy($scope.originalPublication);
            $scope.selectedSubjects = angular.copy($scope.originalSelectedSubjects);
            $scope.selectedTenantName = angular.copy($scope.originalSelectedTenantName);
            $scope.selectedTenantType = null;
            
            $scope.loadCsSubjects(false);
            $scope.loadCsPublications(false);
			$scope.editableForm.$setPristine();
			$scope.editableForm.$cancel();
        };
        
        $scope.edit = function() {
			$scope.formAction = 'Edit';
            $scope.originalPublication = angular.copy($scope.publication);
            $scope.originalSelectedSubjects = angular.copy($scope.selectedSubjects);
            $scope.originalSelectedTenantName = angular.copy($scope.selectedTenantName);
            $scope.editableForm.$show();
        };
		
		$scope.changeTenant = function(newTenant){
            if(newTenant){
                $scope.publication.tenantId = newTenant.id;
            }else{
                $scope.publication.tenantId = null;
            }
            $scope.selectedSubjects = [];
            $scope.refreshSubjects($scope.publication.tenantId);
        };

  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    		if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
    			if(!confirm("You have unsaved changes. Are you sure you want to leave this page?")){
    				event.preventDefault();
    			}
	    	}
  		});
  		
		//~ START subject select2 setup  =======================================
		$scope.refreshSubjects = function(tenantId) {
            if (tenantId) {
                var searchParams = { "pageSize":"500", "sortKey":"name", "tenantId":tenantId, "inactive":false };
                SubjectService.search(searchParams).then(function(response) {
                    $scope.subjects = response.data.searchResults; 
                }); 
            } else {
                $scope.subjects = [];
            }
        };
		$scope.refreshSubjects($scope.publication.tenantId);
		
		
  	    $scope.subjectSelector = { 
  	        'placeholder': "Select...",
  	        'multiple': true, 
  	        'width' :'resolve',
  	        'query': function (query) {
  	            var data = { results: $scope.convertSubjectsToSelect2Array($scope.subjects) };
  	            query.callback(data);
  	        },
  	        'id': function(select2Object) {  // retrieve a unique id from a select2 object
  	            var subject = select2Object.id;
  	            return subject.id; 
  	        },
  	        'setPristine': true
        };
        //~ END subject select2 setup =======================================
          		
        //~ START core standards integration =======================================
        var publisherParams = { "hierarchy":"publisher" };
        CoreStandardsService.search(publisherParams).then( function(response) {
            $scope.coreStandardPublishers = response.data.payload;
        });
        
        $scope.changeCsPublisher = function(data){
        	$scope.publication.coreStandardsPublisherKey = data;
            $scope.loadCsSubjects(true);
            $scope.loadCsPublications(true);
        };
        
        $scope.changeCsSubject = function(data){
        	$scope.publication.coreStandardsSubjectKey = data;
            $scope.loadCsPublications(true);
        };
        
        $scope.getPublicationDisplay = function(publication) {
            return "V" + publication.version + "-" + publication.description;
        };
        //~ END core standards integration =======================================
         
	}]);

