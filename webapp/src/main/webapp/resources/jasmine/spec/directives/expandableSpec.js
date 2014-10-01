describe('Expandable', function() {

  var scope = null;
  var expandableElement = null;
  var directiveScope = null;

  // you need to indicate your module in a test
  beforeEach(module('testauth', function($provide) {
      return $provide.decorator('$state', function () {
          return {
              transitionTo: function (path) {
                  return {};
              },
          };
      });
  }));
  
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $compile, $http, $templateCache) {
      // create a scope object for us to use.
      scope = $rootScope.$new();
      expandableElement = $compile('<div class="exp" expandable><p>Here is a paragraph</p></div>')(scope);
      scope.$apply();
      directiveScope = expandableElement.scope();

  }));
  
  it("should be collapsed by default", function() {
	  expect(directiveScope.expanded).toBe(false);
	  expect(directiveScope.iconClass).toContain("plusMin");
	  expect(directiveScope.iconClass).toContain("expander-closed");
  });
  
  it("should toggle open and closed", function() {
	  directiveScope.toggle();
	  expect(directiveScope.expanded).toBe(true);
	  expect(directiveScope.iconClass).toContain("plusMin");
	  expect(directiveScope.iconClass).toContain("expander-open");
	  directiveScope.toggle();
	  expect(directiveScope.expanded).toBe(false);
	  expect(directiveScope.iconClass).toContain("plusMin");
	  expect(directiveScope.iconClass).toContain("expander-closed");
  });
  
});