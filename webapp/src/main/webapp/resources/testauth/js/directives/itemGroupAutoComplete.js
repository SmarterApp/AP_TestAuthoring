testauth.directive("itemGroupAutoComplete", function(ItemGroupService,$timeout) {
    return {
        restrict : "A",
        replace: true,
        require: ["ngModel"],
        scope : {
            itemGroupModel : '=',
            assessmentId: '@',
            onSelect : '&'
        },
        transclude : false,
        templateUrl : 'resources/testauth/partials/item-group-auto-complete.html',
        link: function(scope, element, attr, ctrls) {
        	var jqElement = $(element);
            // force typeahead popup on-focus
            jqElement.bind('focus', function() {
                $timeout(function() { // timeout necessary for IE10 to work..
                    ctrls[0].$setViewValue(ctrls[0].$viewValue ? ctrls[0].$viewValue : " ");
                }, 1);
            });
            jqElement.bind("keyup", function() {
            	if ((e.keyCode === 8 || e.keyCode === 46) && jqElement.val() === "") {
            		jqElement.blur();
            		jqElement.focus();
            	}
            });
        },
        controller : function($scope, $attrs) {
            $scope.filterItemGroups = function(searchVal) {
                var searchParams = {"assessmentId":$scope.assessmentId, "groupName":searchVal, "currentPage":"0", "pageSize":"20", "sortKey":"groupName", "sortDir":"asc"};
                return ItemGroupService.search(searchParams).then( function(loadedData) {
                    return loadedData.data.searchResults;
                });
            };
        }
    };
});