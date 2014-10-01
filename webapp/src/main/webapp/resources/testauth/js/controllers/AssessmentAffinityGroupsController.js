testauth.controller('AssessmentAffinityGroupsController', ['$scope', '$state', 'loadedData', 'loadedSegments', 'AffinityGroupService',
    function ($scope, $state, loadedData, loadedSegments, affinityGroupService) {
		$scope.searchResponse = {};
        $scope.errors = loadedData.errors;
        $scope.errorsMap = {};
        $scope.messages = loadedData.messages;
        $scope.assessment = loadedData.data;
        
        $scope.segments = [];
        $scope.segmentMap = {};
        $scope.segmentParamTypeMap = {}; //{segmentId: {paramName:type}}
        $scope.segments.push({'id':'MASTER', 'label':'Master'});
        $scope.algorithms = {};
        $scope.algorithms["MASTER"] = {};
        angular.forEach(loadedSegments.data.searchResults, function(segment, i) {
        	$scope.segments.push({'id':segment.id, label: segment.position + " - " + segment.label});
        	$scope.segmentMap[segment.id] = segment;
        	$scope.segmentParamTypeMap[segment.id] = {};
        	$scope.algorithms[segment.id] = segment.itemSelectionAlgorithm;
        	angular.forEach(segment.itemSelectionAlgorithm.blueprintParameters, function(param) {
        		if (param.itemSelectionType === 'List') {
        			$scope.segmentParamTypeMap[segment.id][param.parameterName] = param.itemSelectionType;
        			$scope.segmentParamTypeMap[segment.id][param.parameterName + "List"] = angular.copy(param.itemSelectionList);
        		} else {
        			$scope.segmentParamTypeMap[segment.id][param.parameterName] = param.itemSelectionType;
        		}
        	});
        });
        
        $scope.activeOptions = [
	          { key: true, label: 'Active' },
	          { key: false, label: 'Inactive' }
	    ];
		
        $scope.getDefaultSearchParams = function() {
        	return { "assessmentId" : $scope.assessment.id, "sortKey" : "name", "sortDir" : "asc", "segmentId":"MASTER", "active":"", "pageSize":10};
        };
        
        if (!$state.current.searchParams) {
			$scope.searchParams = $scope.getDefaultSearchParams();
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
               
        $scope.searchAffinityGroups = function(params) {
        	return affinityGroupService.searchAffinityGroups(params);
        };
        
        $scope.addNewAffinityGroup = function() {
        	$state.transitionTo("assessmenthome.affinityGroupForm", {assessmentId:$scope.assessment.id});
        };
        
        $scope.editAffinityGroup = function(affinityGroupId) {
			var params = {assessmentId:$scope.assessment.id, affinityGroupId:affinityGroupId};
			$state.transitionTo("assessmenthome.affinityGroupForm", params);
        };
        
		$scope.removeAffinityGroup = function(affinityGroup) {
        	if(confirm("Are you sure you want to delete this Affinity Group?")) {
        		affinityGroupService.remove(affinityGroup).then(function(response) {
                    $scope.errors = response.errors;
                    $scope.$broadcast('initiate-affinityGroup-search');
                });
        	}
        };
        $scope.edit = function(frm) {
        	$scope.originalAffinityGroups = angular.copy($scope.searchResponse.searchResults);
            $scope.originalErrors = angular.copy($scope.errors);
        	frm.$show();
        };
        
        $scope.saveAll = function(affinityGroupList, frm) {
        	$scope.errorsMap = {};
        	var isValid = $scope.validateAffinityGroups(affinityGroupList, $scope.searchParams.segmentId);
        	$scope.saveIndicator = true;
			return affinityGroupService.updateCollection(affinityGroupList).then(function(response) {
				$scope.savingIndicator = false;
				$scope.errors = response.errors;
				$scope.errorsMap = mergeMaps($scope.errorsMap, response.messages);
				if($scope.errors.length == 0 && jQuery.isEmptyObject($scope.errorsMap)){
					frm.$setPristine();
					$scope.isNew = false;
					$scope.$broadcast('initiate-affinityGroup-search');
					$scope.saveIndicator = false;
					$scope.disabledSearch = false;
					return true;
				} else {
					return "Error";
				}
			});
        };
        var mergeMaps = function(map1, map2) {
        	for (var obj in map1) {
        		map2[obj] = map1[obj];
        	}
        	return map2;
        };
        var fieldsToCheck = { 
                operationalItemMinValue: "Operational Item Min", 
                operationalItemMaxValue: "Operational Item Max", 
                fieldTestItemMinValue: "Field Test Item Min", 
                fieldTestItemMaxValue: "Field Test Item Max"
        };
        $scope.validateAffinityGroups = function(affinityGroupList, segmentId) {
        	var isValid = true;
        	for (var i = 0; i < affinityGroupList.length; i++) {
        		for (var fieldToCheck in fieldsToCheck) {
        			var data = affinityGroupList[i].affinityGroupValueMap[segmentId][fieldToCheck];
        			if ( (data.toString().indexOf('.') > -1) || (data >>> 0 !== parseFloat(data))) {
        				isValid = false;
        				var fieldname = "affinityGroups[" + i + "].affinityGroupValueMap[" + segmentId + "]." + fieldToCheck;
        				$scope.errorsMap[fieldname] = fieldsToCheck[fieldToCheck] + " must be a positive integer";
        			}
        		}
        	}
        	return isValid;
        };
        
        $scope.cancel = function(frm) {
            $scope.searchResponse.searchResults = angular.copy($scope.originalAffinityGroups);
            $scope.errors = [];
            $scope.errorsMap = {};
		    $scope.disabledSearch = false;
		    frm.$setPristine();
		    frm.$cancel();
        };
        
        $scope.disableSearch = function() {
        	$scope.disabledSearch = true;
        };
        
        $scope.hasValidationError = function(affinityGroupIndex, segmentId, field) {
//        	affinityGroups[0].affinityGroupValueMap[538787c13004d0ba43e55e9c].fieldTestItemMaxValue 
        	var fieldname = "affinityGroups[" + affinityGroupIndex + "].affinityGroupValueMap[" + segmentId + "]." + field;
        	if ($scope.errorsMap) {
        		return $scope.errorsMap[fieldname];
        	}
        	return "";
        };
        
        $scope.hasSelectionParamValidationError = function(affinityGroupIndex, segmentId, parameterName) {
        	//affinityGroups[0].affinityGroupValueMap[538787c13004d0ba43e55e9c].itemSelectionParameters[FFP2]
        	var fieldname = "affinityGroups[" + affinityGroupIndex + "].affinityGroupValueMap[" + segmentId + "].itemSelectionParameters[" + parameterName + "]";
        	if ($scope.errorsMap) {
        		return $scope.errorsMap[fieldname];
        	}
        	return "";
        };

}]);