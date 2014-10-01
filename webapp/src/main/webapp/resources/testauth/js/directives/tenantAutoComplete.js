testauth.directive("tenantAutoComplete", function(ProgmanService) {
    return {
        restrict : "A",
        replace: true,
        scope : {
            tenantModel : '=',
            tenantType : '@',
            onSelect : '&',
            valueAttribute: '@'
        },
        transclude : false,
        templateUrl : 'resources/testauth/partials/tenant-auto-complete.html',
        controller : function($scope, $attrs) {
            $scope.pageableParams = {"page":"1", "pageSize":"20", "pageSort":"name", "pageSortDir":"asc"};
            $scope.filterTenants = function(searchVal, tenantType) {
                return ProgmanService.findTenantsByComponentAndSearchVal(testauthComponentName,true,searchVal,tenantType,$scope.pageableParams).then( function(loadedData) {
                    return loadedData.data;
                });
            };
        },
        link : function(scope, element, attrs) {
        	 scope.hasAttribute = false;
             if(attrs.valueAttribute){
             	scope.hasAttribute = true;
             }
        }
    };
});