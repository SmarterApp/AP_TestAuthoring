describe('CoreStandards Service', function() {
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
    
  beforeEach(inject(function(CoreStandardsService, _$httpBackend_) {
      serviceMock = CoreStandardsService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
 
  it('should make GET request when searching for Publication by Grade', inject(function(CoreStandardsService) {
      httpMock.expectGET(new RegExp('coreStandard/publication')).respond(201,"http response");
      
      var returnedPromise = serviceMock.searchGradeByPublication("grade","10", {});
      returnedPromise.then(function(response) {
          expect(response.data).toBe("http response");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  }));
  
});

