testauth.controller('AssessmentEditController',['$scope','$state', 'loadedData', 'AssessmentService', 'CurrentUserService', 'PublicationService', 'CoreStandardsService', 
    function($scope, $state, loadedData, AssessmentService, CurrentUserService, PublicationService, CoreStandardsService) {
		$scope.savingIndicator = false;
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
		$scope.grades = [];
		$scope.selectedGrades = [];
		$scope.publication = '';
		$scope.actionButton = '';
		$scope.formAction = 'Add';
		$scope.percentage = 0;

		$scope.gradesSelector = {
   	   			'placeholder': "Select...",
   	   			'allowClear': true,
   	   			'multiple': true,
   	   	        'simple_tags': false,
   	   	        'width' :'resolve',
   	   	        "data": function() {
   	   	        	var data = { results: $scope.convertGradesToSelect2Array($scope.grades) };
   	   	        	return data;
   	   	        },
   	  	        'id': function(select2Object) {  // retrieve a unique id from a select2 object
   	  	            return select2Object.id; 
   	  	        },
                'setPristine': true
   	   	};
        
        $scope.convertGradesToSelect2Array = function(grades) {
            return $.map( grades, function(grade) { return { "id":grade.key, "text":grade.name }; });
        };
        
        $scope.convertGradesToStrings = function(grades) {
        	return $.map( grades, function(grade) { return grade; } );
        };
		
		PublicationService.getSubjectsAssignedToPublications(CurrentUserService.getTenantId()).then(function(response) {
            $scope.availableSubjects = response.data;
		});
		
		AssessmentService.getAssessmentTypes().then(function(response) {
		    $scope.availableAssessmentTypes = response.data;
		});
		
		$scope.save = function(){
			$scope.savingIndicator = true;
			$scope.assessment.tenantId = CurrentUserService.getTenantId();
			if ($scope.isNew) {
				$scope.assessment.grade = $.map( $scope.selectedGrades, function(select2Object) { return select2Object.id; } );
			}
			// this is for the initial creation only
			if($scope.assessment.version == null) {
				$scope.assessment.status = "In Progress";
				$scope.assessment.version = "1.0";
			}
			
			return AssessmentService.save($scope.assessment).then(function(response){
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				if($scope.errors.length == 0){
					$scope.editableForm.$setPristine();
					$scope.assessment = response.data;
					AssessmentService.updateCache(response.data);
					if ($scope.resetAssessment) {
					    $scope.resetAssessment(response.data);
					}
					$scope.isNew = false;
					$state.transitionTo("assessmenthome.detailhome.edit", {assessmentId:$scope.assessment.id});
				}else{
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
			$state.transitionTo("assessmentsearch");
		};
		
		$scope.edit = function() {
            $scope.originalAssessment = angular.copy($scope.assessment);
		    $scope.editableForm.$show();
		};
		
		$scope.cancel = function() {
            $scope.assessment = angular.copy($scope.originalAssessment);
            $scope.editableForm.$setPristine();
		    $scope.editableForm.$cancel();
		    $scope.errors = [];
		};
		
  		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    		if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
    			if(!confirm("You have unsaved changes. Are you sure you want to leave this page?")){
    				event.preventDefault();
    			}
	    	}
  		});
  		
         $scope.loadPublications = function(clearSelection) {
            if ( clearSelection ) {
                $scope.assessment.publicationId = null;
                $scope.editableForm.publicationId.$setViewValue(null);
                $scope.publications = null;
            }
            
            if ($scope.assessment.subjectId) {
            	var publicationParams = { "hierarchy":"publication", "tenantId":CurrentUserService.getTenantId(), "subjectIds":$scope.assessment.subjectId };
                PublicationService.search(publicationParams).then( function(response) {
                    $scope.publications = response.data.searchResults;
                });
            } else {
                $scope.publications = [];
            }
        };
        
        $scope.loadGrades = function(clearSelection) {
            if ( clearSelection ) {
                $scope.assessment.grade = null;
                $scope.assessment.publication = null;
                $scope.selectedGrades = [];
            }
            
            if(!$scope.assessment.publication) {
            	if($scope.publications) {
	            	var csPubKey = $scope.findCsPublicationKey();
	            	$scope.assessment.publication = JSON.parse('{"coreStandardsPublicationKey": "' + csPubKey + '"}');
            	}
            }
            
            if ($scope.assessment.subjectId && $scope.assessment.publicationId) {
            	var gradeParams = { "publicationKey":$scope.assessment.publication.coreStandardsPublicationKey };
            	CoreStandardsService.searchGradeByPublication(gradeParams).then( function(response) {
                    $scope.grades = response.data.payload;
                });
            } else {
                $scope.grades = [];
            }
        };
        
        $scope.findCsPublicationKey = function() {
        	for(var pub = 0; pub < $scope.publications.length; pub++) {
        		if($scope.publications[pub].id == $scope.assessment.publicationId) {
        			return $scope.publications[pub].coreStandardsPublicationKey;
        		}
        	}
        	return null;
        };
        
		if ($scope.assessment && $scope.assessment.id) {
			$scope.formAction = 'Edit';
			$scope.selectedGrades = $scope.convertGradesToStrings($scope.assessment.grade);
            $scope.loadPublications(false);
            $scope.loadGrades(false);
            $scope.isNew = false;
		} else {
			$scope.isNew = true;
		}
  		
        $scope.changeSubject = function(data){
        	$scope.assessment.subjectId = data;
            $scope.loadPublications(true);
            $scope.loadGrades(true);
        };
        
        $scope.changePublication = function(data){
        	$scope.assessment.publicationId = data;
            $scope.loadGrades(true);
        };
        
	}]);
