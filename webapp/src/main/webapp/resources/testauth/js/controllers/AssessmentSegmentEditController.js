
testauth.controller('AssessmentSegmentEditController',['$scope','$state', 'loadedData', 'loadedSegment', 'segmentList', 'algorithmList', 'SegmentService', 'BlueprintElementService',
    function($scope, $state, loadedData, loadedSegment, segmentList, algorithmList, SegmentService, BlueprintElementService) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.segment = loadedSegment.data;
        $scope.lockOpItems = ($scope.selectedAlgorithm && $scope.selectedAlgorithm.itemSelectionAlgorithmType == "Field Test");
        $scope.segmentList = segmentList.data.searchResults;
        $scope.algorithmList = algorithmList.data.searchResults;

        $scope.segment.assessmentId = $scope.assessment.id;

        $scope.updateSelectedAlgorithm = function(algorithmId,populateWithDefaults) {
            var foundAlgorithms = $.grep($scope.algorithmList, function(elem) { return elem.id == algorithmId; });
            $scope.selectedAlgorithm = foundAlgorithms.length > 0 ? foundAlgorithms[0] : null;
            if ($scope.selectedAlgorithm && $scope.selectedAlgorithm.itemSelectionAlgorithmType == "Field Test") {
            	$scope.clearOPItems();
            } else {
            	$scope.lockOpItems = false;
            	if ( $scope.editableForm ) {
                    $scope.editableForm.minOpItems.$setViewValue( $scope.editableForm.minOpItems.$viewValue );
                    $scope.editableForm.maxOpItems.$setViewValue( $scope.editableForm.maxOpItems.$viewValue );
            	}
            }
            if (populateWithDefaults) {
                $scope.segment.itemSelectionParameters = {};
                if ($scope.selectedAlgorithm) {
                    angular.forEach($scope.selectedAlgorithm.scalarParameters, function(param){
                        $scope.segment.itemSelectionParameters[param.parameterName] = param.defaultValue;
                    });
                }
            }
        };

        $scope.clearOPItems = function() {
        	$scope.lockOpItems = true;
        	if ( $scope.editableForm ) {
        	    // hack to get xeditable to work right...
                var userEnteredMin = $scope.editableForm.minOpItems.$viewValue;
                var userEnteredMax = $scope.editableForm.maxOpItems.$viewValue;
        	    $scope.editableForm.minOpItems.$setViewValue("0"); // this value is what will be passed to server
                $scope.editableForm.maxOpItems.$setViewValue("0");
                $scope.editableForm.minOpItems.$viewValue = userEnteredMin;
                $scope.editableForm.maxOpItems.$viewValue = userEnteredMax;
        	}
        };
        
        $scope.actionButton = '';
        $scope.formAction = 'Add';
        if ($scope.segment && $scope.segment.id) {
            $scope.formAction = 'Edit';
			$scope.isNew = false;
            $scope.updateSelectedAlgorithm($scope.segment.itemSelectionAlgorithmId,false);
        } else {
			$scope.isNew = true;
            $scope.segment.position = $scope.segmentList.length + 1;
            $scope.segment.itemSelectionParameters = {};
        }
       
        $scope.save = function() {
            $scope.savingIndicator = true;            
            return SegmentService.save($scope.segment).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
                $scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.editableForm.$setPristine();
                    $scope.segment = response.data;
                    $scope.isNew = false;
                    $state.transitionTo("assessmenthome.segmentedit", {assessmentId:$scope.assessment.id, segmentId:$scope.segment.id});
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
        
        $scope.edit = function() {
            $scope.originalSelectedAlgorithm = angular.copy($scope.selectedAlgorithm);
            $scope.originalSegment = angular.copy($scope.segment);
            $scope.editableForm.$show();
        };

        $scope.cancel = function() {
            $scope.selectedAlgorithm = angular.copy($scope.originalSelectedAlgorithm);
            $scope.segment = angular.copy($scope.originalSegment);
        	$scope.editableForm.$cancel();
			$scope.editableForm.$setPristine();
			$scope.errors = [];
			$scope.messages = {};
			$scope.lockOpItems = ($scope.selectedAlgorithm && $scope.selectedAlgorithm.itemSelectionAlgorithmType == "Field Test");
        };

        $scope.returnToSearch = function() {
            $scope.actionButton = 'cancel';
            $scope.editableForm.$setPristine();
            $state.transitionTo("assessmenthome.segment", {assessmentId:$scope.assessment.id});
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });

    }]);
