testauth.directive("itemAutoComplete", function(ItemService,$timeout) {
    return {
        restrict : "A",
        replace: true,
        require: ["ngModel"],
        scope : {
            itemModel : '=',
            assessmentId: '@',
            onSelect : '&'
        },
        transclude : false,
        templateUrl : 'resources/testauth/partials/item-auto-complete.html',
        link: function(scope, element, attr, ctrls) {
            // force typeahead popup on-focus
        	var jqElement = $(element);
            jqElement.bind('focus', function() {
                $timeout(function() { // timeout necessary for IE10 to work..
                    ctrls[0].$setViewValue(ctrls[0].$viewValue ? ctrls[0].$viewValue : " ");
                }, 1);
            });
            jqElement.bind('keyup', function(e) {
            	if ((e.keyCode === 8 || e.keyCode === 46) && jqElement.val() === "") {
            		jqElement.blur();
            		jqElement.focus();
            	}
            });
        },
        controller : function($scope, $attrs) {
            $scope.filterItems = function(searchVal) {
                return ItemService.findFirst20DistinctItemsByAssessmentIdAndSearchVal($scope.assessmentId,searchVal).then( function(loadedData) {
                    return loadedData.data;
                });
            };
            
            $scope.limitText = function(text) {
                var maxLength = 70;
                if (text && text.length > maxLength) {
                    text = text.substring(0,maxLength) + "...";
                }
                return text;
            };
        }
    };
});