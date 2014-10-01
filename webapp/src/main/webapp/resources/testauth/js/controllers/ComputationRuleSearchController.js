
testauth.controller('ComputationRuleSearchController', ['$scope', '$state', 'ComputationRuleService',
     function ComputationRuleSearchController($scope, $state, ComputationRuleService) {
		if (!$state.current.searchParams) {
			$scope.searchParams = {"name":"", "sortKey":"name", "sortDir":"asc", "currentPage": 1, "pageSize":10};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};

  		$scope.searchComputationRules = function(params) {
  			return ComputationRuleService.search(params);
  		};

  		$scope.postProcessComputationRules = function(computationRule) {
  		};

  		$scope.createNewComputationRule = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.computationRuleId = "";
            $state.transitionTo("computationRuleForm", params);
        };

  		$scope.remove = function(computationRule) {          
            if(confirm("Are you sure you want to delete this Computation Rule?")) {
                ComputationRuleService.remove(computationRule).then( function(response) {
                    $scope.errors = response.errors;
                    var index = $scope.searchResponse.searchResults.indexOf(computationRule);
                    $scope.searchResponse.searchResults.splice(index, 1);
                });
            };
        };

  		$scope.view = function(computationRule) {
  			$state.transitionTo("computationRuleForm", {computationRuleId:computationRule.id });
  		};
     }]);
