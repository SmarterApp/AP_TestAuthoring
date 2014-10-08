testauth.directive("tibMetadataAutoComplete", function(TibItemService,$timeout) {
    return {
        restrict : "A",
        require:["ngModel"],
        replace: true,
        scope : {
            metadataKey: '=',
            metadataValueModel: '=',
            tenantId: '=',
            onSelect : '&',
        },
        transclude : false,
        templateUrl : 'resources/testauth/partials/tib-metadata-auto-complete.html',
        controller : function($scope, $attrs) {
            $scope.searchParams = {"page":"1", "pageSize":"10", "pageSort":"metadataValue", "pageSortDir":"asc"};
            $scope.filterMetadataValues = function(searchVal) {
            	if($scope.metadataKey) {
	                $scope.searchParams.tenantId = $scope.tenantId;
	                $scope.searchParams.metadataKey = $scope.metadataKey;
	                $scope.searchParams.metadataValue = searchVal ? searchVal.trim() : "";
	                return TibItemService.getItemMetadataValues($scope.searchParams).then( function(loadedData) {
	                    return loadedData.data.searchResults;
	                });
            	}
            };
        },
        link : function(scope, element, attrs, ctrls) {        
            // force typeahead popup on-focus
            var jqElement = $(element);
            jqElement.bind('focus', function() {
                $timeout(function() { // timeout necessary for IE10 to work..
                    ctrls[0].$setViewValue(ctrls[0].$viewValue ? ctrls[0].$viewValue : " ");
                }, 1);
            });
            jqElement.bind('keyup', function() {
                if (jqElement.val() === "") {
                    jqElement.focus();
                }
            });
        }
    };
});

