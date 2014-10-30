testauth.controller('AssessmentAffinityGroupFormController', ['$scope', '$filter', '$state', 'loadedData', 'loadedAffinityGroup', 'AffinityGroupService', 'CoreStandardsService',
    function ($scope, $filter, $state, loadedData, loadedAffinityGroup, affinityGroupService, coreStandardsService) {
		$scope.searchResponse = {};
        $scope.errors = loadedData.errors;
        $scope.messages = loadedData.messages;
        $scope.assessment = loadedData.data;
        $scope.affinityGroup = loadedAffinityGroup.data;
        $scope.affinityGroup.assessmentId = $scope.assessment.id;
        $scope.socks = [];
        $scope.affinityGroupType = "adhoc";
		$scope.actionButton = '';
        
        coreStandardsService.searchSocksByPublication({"publicationKey":$scope.assessment.publication.coreStandardsPublicationKey}).then(function(response) {
        	angular.forEach(response.data.payload, function(sock) {
        		$scope.socks.push(sock);
        		if (sock.description == $scope.affinityGroup.groupName) {
        			$scope.affinityGroupType = "sock";
        			$scope.affinityGroup.sock = sock.description;
        		}
        	});
        });
        
        if ($scope.affinityGroup && $scope.affinityGroup.id) {
			$scope.isNew = false;
		} else {
			$scope.isNew = true;
		}
        
        $scope.back = function() {
            $scope.actionButton = 'cancel';
        	$state.transitionTo("assessmenthome.affinityGroups", {assessmentId:$scope.assessment.id});
        };
        
        $scope.save = function() {
			$scope.savingIndicator = true;

			if ($scope.isNew) {
				$scope.affinityGroup.active = true;
			}
			if ($scope.affinityGroupType == "sock") {
				$scope.affinityGroup.groupName = null;
			}
			if ($scope.affinityGroupType == "sock" && $scope.affinityGroup.sock) {
				$scope.affinityGroup.groupName = $scope.affinityGroup.sock;
			}
			
			return affinityGroupService.save($scope.affinityGroup).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = response.messages;
				if($scope.errors.length === 0){
					$scope.editableForm.$setPristine();
					$scope.affinityGroup = response.data;
					if ($scope.affinityGroupType == "sock") {
						$scope.affinityGroup.sock = $scope.affinityGroup.groupName;
					}
					$scope.isNew = false;
					$state.transitionTo("assessmenthome.affinityGroupForm", {assessmentId:$scope.assessment.id, affinityGroupId:$scope.affinityGroup.id});
//					return true;
				}else{
					if ($scope.errorsMap["groupName"]) {
						$scope.errorsMap["sock"] = $scope.errorsMap["groupName"];
					}
					angular.forEach($scope.errorsMap, function(msg,key){
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);	
					});
					return "Error";
				}
			});
		};
		$scope.edit = function() {
            $scope.originalAffinityGroup = angular.copy($scope.affinityGroup);
            $scope.originalAffinityGroupType = angular.copy($scope.affinityGroupType);
            $scope.editableForm.$show();
		};
		
        $scope.cancel = function() {
            $scope.affinityGroup = angular.copy($scope.originalAffinityGroup);
            $scope.affinityGroupType = angular.copy($scope.originalAffinityGroupType);
            $scope.editableForm.$setPristine();
		    $scope.editableForm.$cancel();
		    $scope.errors = [];
        };

		$scope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
					if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
						event.preventDefault();
					}
				}
		});
}]);