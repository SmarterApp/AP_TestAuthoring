describe('itemAutoComplete', function() {
	var scope = null;
	var autoCompleteElement = null;
	var directiveScope = null;
	var itemService = null;
	var state = null;
				
	var template = '<input type="text" '
			+ 'placeholder="Select..." '
			+ 'data-ng-model="itemModel" '
			+ 'data-typeahead="availableItem as availableItem ? limitText(availableItem.tibIdentifier + \' - \' + availableItem.description) : \'\' for availableItem in filterItems($viewValue)" '
			+ 'data-typeahead-wait-ms="200" '
			+ 'data-typeahead-editable="false" '
			+ 'data-typeahead-min-length="-1" '
			+ 'data-typeahead-on-select="onSelect({newItem:$item,newItemLabel:$label})" />';

	// you need to indicate your module in a test
	beforeEach(module('testauth', function($provide) {
		return $provide.decorator('$state', function() {
			return {
				transitionTo : function(path) {
					return {};
				},
			};
		});
	}));

	beforeEach(inject(function($rootScope, $compile, $injector, $state, $http, $q, $templateCache, ItemService) {
		// create a scope object for us to use.
		scope = $rootScope;
		
		
		$templateCache.put('resources/testauth/partials/item-auto-complete.html', template);
        
//		autoCompleteElement = $compile('<span data-item-auto-complete></span>')(scope);
	    autoCompleteElement = angular.element('<span data-item-auto-complete></span>');
	    $compile(autoCompleteElement)(scope);
		scope.$apply();
		directiveScope = autoCompleteElement.scope();
		itemService = ItemService;

		scope.$digest();
		directiveScope.$digest();
	}));
	
	afterEach(function () {
		//autoCompleteElement.remove();
	});
	//TODO: can't figure out how to make this work.
	xit("should call the item service", function() {
		scope.assessment = { id: "assessment-id" };
		itemService.findFirst20DistinctItemsByAssessmentIdAndSearchVal = function(aid, val) {
			console.log("blah!");
		};
		spyOn(itemService, "findFirst20DistinctItemsByAssessmentIdAndSearchVal");
		autoCompleteElement.find("input").select();
		var keypress = $.Event('keydown');
        keypress.which = 65;
		autoCompleteElement.find("input").trigger(keypress)
		
//		directiveScope.filterItems("searchVal");
		expect(itemService.findFirst20DistinctItemsByAssessmentIdAndSearchVal).toHaveBeenCalled();
		
	});
	
	//TODO: can't figure out how to make this work.
	xit("should limit text to 70 chars before adding ellipses", function() {
		expect(directiveScope.limitText("XYZ")).toBe("XYZ");
	});
});