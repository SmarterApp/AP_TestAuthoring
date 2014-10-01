describe('TibItem Service', function() {
  var httpMock = null;
  var serviceMock = null;
    
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
    
  beforeEach(inject(function(TibItemService, _$httpBackend_) {
      serviceMock = TibItemService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
 
  it('should make GET request when searching for Tib items', inject(function(TibItemService) {
      httpMock.expectGET(new RegExp('tibitem')).respond(201,"http response");
      
      var returnedPromise = serviceMock.searchItems("primaryStandard","SBAC-MA-v1:1", "status","OP", {});
      returnedPromise.then(function(response) {
          expect(response.data).toBe("http response");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  }));
  
});

