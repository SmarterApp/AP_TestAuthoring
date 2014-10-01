
testauth.controller('ItemSelectionAlgorithmSearchController', [ '$scope', '$state', 'ItemSelectionAlgorithmService',
	function ItemSelectionAlgorithmSearchController($scope, $state, ItemSelectionAlgorithmService) {
		if (!$state.current.searchParams) {
			$scope.searchParams = { "name" : "", "sortKey" : "name", "sortDir" : "asc", "currentPage" : 1, "pageSize":10 };
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
		$scope.searchResponse = {};

		$scope.searchItemSelectionAlgorithms = function(params) {
			return ItemSelectionAlgorithmService.search(params);
		};

		$scope.postProcessItemSelectionAlgorithms = function(itemSelectionAlgorithm) {
			if (itemSelectionAlgorithm.parameters == null) {
				itemSelectionAlgorithm.scalarParameters = [];
				itemSelectionAlgorithm.blueprintParameters = [];
			}
		};

		$scope.createNewItemSelectionAlgorithm = function() {
			var params = {};
			angular.copy($scope.searchParams, params);
			params.itemSelectionAlgorithmId = "";
			$state.transitionTo("itemSelectionAlgorithmForm", params);
		};
		
		$scope.availableItemSelectionAlgorithmTypes = [];
		ItemSelectionAlgorithmService.getItemSelectionAlgorithmTypes().then(
				function(response) {
					$scope.availableItemSelectionAlgorithmTypes.push('');
					$scope.availableItemSelectionAlgorithmTypes = $scope.availableItemSelectionAlgorithmTypes.concat(response.data);
					$scope.searchParams.itemSelectionAlgorithmType = '';
		});

		$scope.remove = function(itemSelectionAlgorithm) {
			if (confirm("Are you sure you want to delete this Item Selection Algorithm?")) {
				ItemSelectionAlgorithmService.remove(itemSelectionAlgorithm).then(
					function(response) {
						$scope.errors = response.errors;
						var index = $scope.searchResponse.searchResults.indexOf(itemSelectionAlgorithm);
						$scope.searchResponse.searchResults.splice(index, 1);
					});
			}
		};

		$scope.view = function(itemSelectionAlgorithm) {
			$state.transitionTo("itemSelectionAlgorithmForm", { itemSelectionAlgorithmId : itemSelectionAlgorithm.id });
		};
	}
]);
