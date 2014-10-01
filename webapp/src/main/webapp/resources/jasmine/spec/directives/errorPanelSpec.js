describe('Error Panel', function() {
  var scope = null;
  var template = null;

  var toggleElement = null;
  var toggleElementScope = null;
  var openElement = null;
  var openElementScope = null;
    
  // temporary fix for external template issue
  template = '\
      <div data-ng-transclude></div> \
      <div class="errorBox" data-ng-show="errorList.length"> \
          <div class="centered"> \
              <div id="header" data-ng-if="!isAlwaysExpanded()"> \
                  Please fix errors in order to save information:  \
                  <i data-ng-click="toggleErrors()" class="treeExpander {{showErrors ? \'expanded\' : \'collapsed\'}}"></i> \
              </div> \
              <div data-ng-class="{offset:!isAlwaysExpanded()}"> \
                  <div id="errorList" data-ng-hide="!showErrors" data-ng-repeat="error in errorList | orderBy:\'toString()\'"> \
                      <span class="icon_sprite icon_error error"></span> \
                      {{error}} \
                  </div> \
              </div> \
          </div> \
      </div>';
  
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
      
      // setup directive template
      $templateCache.put('resources/testauth/partials/error-panel.html', template);
      
      scope.errorList = [];
      toggleElement = $compile('<div data-error-panel data-error-list="errorList" data-always-expanded="{{false}}"></div>')(scope);
      openElement = $compile('<div data-error-panel data-error-list="errorList" data-always-expanded="{{true}}"></div>')(scope);
      scope.$apply();
            
      toggleElementScope = toggleElement.scope();
      openElementScope = openElement.scope();
  }));
  
  afterEach(function () {
      toggleElement.remove();
      openElement.remove();
  });

  it('should hide errorBox when no errors', function() {
      var errorBox = toggleElement.find('div.errorBox');      
      expect(errorBox.attr('class')).toContain('ng-hide');
  });
  
  it('should hide errorBox when there are  errors', function() {
      toggleElementScope.errorList = ["error1"];
      toggleElementScope.$apply();
      
      var errorBox = toggleElement.find('div.errorBox');      
      expect(errorBox.attr('class')).not.toContain('ng-hide');
  });
  
  it('should show errorList with 1 error', function() {
      toggleElementScope.errorList = ["error1"];
      toggleElementScope.$apply();
      
      var errorList = toggleElement.find('#errorList');
      expect(errorList.length).toBe(1);
  });
  
  it('should show errorList with multiple errors', function() {
      toggleElementScope.errorList = ["error1", "error2", "error3"];
      toggleElementScope.$apply();
      
      var errorList = toggleElement.find('#errorList');
      expect(errorList.length).toBe(3);
  });
  
  it('should show header if not always expanded', function() {
      toggleElementScope.errorList = ["error1"];
      toggleElementScope.$apply();
      
      var headerDiv = toggleElement.find("#header");
      expect(headerDiv.length).toBe(1);
  });
  
  it('should hide header if always expanded', function() {
      openElementScope.errorList = ["errorX"];
      openElementScope.$apply();

      var headerDiv = openElement.find("#header");
      expect(headerDiv.length).toBe(0);
  });

});

