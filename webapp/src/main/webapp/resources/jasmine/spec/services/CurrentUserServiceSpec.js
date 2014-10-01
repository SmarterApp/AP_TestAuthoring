describe('Current User Service', function() {
  var httpMock = null;
  var service = null;
  
  //you need to indicate your module in a test
  beforeEach(module('testauth', function($provide) {
      return $provide.decorator('$state', function () {
          return {
              transitionTo: function (path) {
                  return {};
              }
          };
      });
  }));
    
  beforeEach(inject(function(CurrentUserService, _$httpBackend_) {
	  service = CurrentUserService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('set and get tenantId', function() {
	  service.setTenantId("asddffd");
	  expect(service.getTenantId()).toBe("asddffd");
  });


});

