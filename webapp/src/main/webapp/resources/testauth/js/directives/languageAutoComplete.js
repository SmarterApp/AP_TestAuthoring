
testauth.directive("languageAutoComplete", function(FormService) {
    return {
        restrict : "A",
        replace: true,
        scope : {
        	languageModel: '=',
            onSelect : '&',
            valueAttribute: '@'
        },
        transclude : false,
        templateUrl : 'resources/testauth/partials/language-auto-complete.html',
        controller : function($scope, $attrs) {
            $scope.pageableParams = {"page":"1", "pageSize":"10", "pageSort":"name", "pageSortDir":"asc"};
            $scope.filterLanguages = function(searchVal) {
                return FormService.findLanguageBySearchVal(searchVal,$scope.pageableParams).then( function(loadedData) {
                    return loadedData.data;
                });
            };
        },
        link : function(scope, element, attrs) {
        	 scope.hasAttribute = false;
             if (attrs.valueAttribute) {
             	scope.hasAttribute = true;
             }
        }
    };
});
