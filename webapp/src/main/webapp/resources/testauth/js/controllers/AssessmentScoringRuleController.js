
testauth.controller('AssessmentScoringRuleController', ['$scope', '$state', 'loadedData', 'ScoringRuleService',
	function ($scope, $state, loadedData, ScoringRuleService) {
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.assessment = loadedData.data;
  		$scope.showTools = true;
	
		if (!$state.current.searchParams) {
			$scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "sortKey":"order", "sortDir":"asc", "pageSize" : 50, "currentPage": 1};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};
	
  		$scope.searchScoringRules = function(params) {
  			return ScoringRuleService.search(params);
  		};

  		$scope.postProcessScoringRules = function(scoringRule) {
  		};
  		
        $scope.isSortHidden = function() {
            return $scope.sortableScoringRuleOptions.length == 1;
        };
		
		$scope.sortableScoringRuleOptions = {
			cursor: $scope.assessment.locked ? "default" : "move",
			disabled: $scope.assessment.locked,
			update: function(e, ui) {
				$scope.orderChanged = true;
			}
		};

  		$scope.createNewScoringRule = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.scoringRuleId = "";
            $state.transitionTo("assessmenthome.scoringruleedit", params);
        };

  		$scope.view = function(scoringRule) {
  			$state.transitionTo("assessmenthome.scoringruleedit", {assessmentId:$scope.assessment.id, scoringRuleId:scoringRule.id});
  		};

  		$scope.remove = function(scoringRule) {          
            if (confirm("Are you sure you want to delete this Scoring Rule?")) {
    			$scope.updateIndicator = true;
                ScoringRuleService.remove(scoringRule).then( function(response) {
                    $scope.updateIndicator = false;
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-scoringrule-search');
                    }
                });
            };
        };

        $scope.saveOrder = function() {          
			$scope.updateIndicator = true;
			$scope.scoringRules = [];
        	for (var i = 0; i < $scope.searchResponse.searchResults.length; i++) {
				var scoringRule = $scope.searchResponse.searchResults[i];
				scoringRule.order = i+1;
        		$scope.scoringRules.push(scoringRule);
        	}
        	
            ScoringRuleService.updateCollection($scope.scoringRules).then( function(response) {
                $scope.errors = response.errors;
				$scope.messages = response.messages;
    			$scope.updateIndicator = false;
				if ($scope.errors.length == 0) {
	                $scope.$broadcast('initiate-scoringrule-search');
					$scope.orderChanged = false;
				}
            });
        };

		$scope.openTools = function(){
			$scope.toggleTools("tools");
		};

		$scope.toggleMissingRules = function(){
			$scope.findMissingBlueprintRules();
			$scope.toggleTools("stats");
		};

        $scope.findMissingBlueprintRules = function() {          
			$scope.updateIndicator = true;
			$scope.unrulyBlueprintElements = [];
        	
            ScoringRuleService.findBlueprintElementsNotCovered($scope.assessment.id).then( function(response) {
				$scope.widgeterrors = response.errors;
    			$scope.updateIndicator = false;
				if ($scope.widgeterrors.length == 0) {
	                $scope.unrulyBlueprintElements = response.data;
				}
            });
        };
        
        $scope.moveToBottom = function() {
        	 $location.hash('bottomOfTable');
        	 $anchorScroll();
        };
        
        $scope.moveToTop = function() {
        	 $location.hash('tableWrapper');
        	 $anchorScroll();
        };
        
        $scope.toggleTools = function(option) {
			$scope.showTools = false;
			$scope.showStats = false;
			
			switch(option) {
			case "tools":
				$scope.showTools = true;
				break;
			case "stats":
				$scope.showStats = true;
				break;
			}
        };
}]);
