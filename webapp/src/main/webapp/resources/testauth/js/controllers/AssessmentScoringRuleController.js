
testauth.controller('AssessmentScoringRuleController', ['$scope', '$state', 'loadedData', 'loadedBlueprintReferenceTypes', 'loadedBlueprintReferences', 'ScoringRuleService',
	function ($scope, $state, loadedData, loadedBlueprintReferenceTypes, loadedBlueprintReferences, ScoringRuleService) {
		$scope.errors = loadedData.errors;
		$scope.messages = loadedData.messages;
		$scope.assessment = loadedData.data;
		$scope.blueprintReferenceTypes = loadedBlueprintReferenceTypes.data;
		$scope.blueprintReferences = loadedBlueprintReferences.data;
  		$scope.showTools = true;
  		$scope.showToolsFocus = false;
  		$scope.showFullList = true;
	
		if (!$state.current.searchParams) {
			$scope.searchParams = {"assessmentId": $scope.assessment.id != null ? $scope.assessment.id : "INVALID_ID", "sortKey":"order", "sortDir":"asc", "pageSize" : 200, "currentPage": 1};
		} else {
			$scope.searchParams = $state.current.searchParams;
		}
  		$scope.searchResponse = {};

  		$(".itemSection").height($(".left_menu_visible_item_mover").height());
  		
  		$scope.searchScoringRules = function(params) {
        	if ($("#blueprintReferenceId").val() && !params.blueprintReferenceId) {
        		var ids = [];
        		for (var i = 0; i < $scope.blueprintReferences.length; i++) {
        			if (!params.blueprintReferenceType || params.blueprintReferenceType == $scope.blueprintReferences[i].blueprintReferenceType) {
	        			if ($scope.blueprintReferences[i].name.toLowerCase().indexOf($("#blueprintReferenceId").val().toLowerCase()) > -1) {
	        				ids.push($scope.blueprintReferences[i].id);
	        			}
        			}
        		}
        		params.blueprintReferenceId = ids;
        	} else if (params.blueprintReferenceId) {
        		params.blueprintReferenceId = params.blueprintReferenceId.id;
        	}
        	if (params.blueprintReferenceId || params.blueprintReferenceType || params.label || $scope.searchParams.pageSize < $scope.searchResponse.totalCount) {
        		$scope.showFullList = false;
        	} else {
        		$scope.showFullList = true;
        	}
  			return ScoringRuleService.search(params);
  		};

  		$scope.postProcessScoringRules = function(scoringRule) {
  		};
  		
        $scope.isSortHidden = function() {
            return $scope.sortableScoringRuleOptions.length == 1;
        };

        $scope.setUpdated = function(event) {
        	// if space bar pressed
        	if(event.keyCode == 32) {
        		$scope.orderChanged = true;
        	}
        };
		
		$scope.sortableScoringRuleOptions = {
			cursor: $scope.assessment.locked ? "default" : "move",
			disabled: $scope.assessment.locked || $scope.fullListNotShown,
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
			$scope.showToolsFocus = true;
			$scope.showStats = false;
			
			switch(option) {
			case "tools":
				$scope.showTools = true;
				$scope.showToolsFocus = true;
				break;
			case "stats":
				$scope.showStats = true;
				break;
			}
        };
  		
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.orderChanged) {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });
}]);
