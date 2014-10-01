describe('Progman Service', function() {
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
    
  beforeEach(inject(function(ProgmanService, _$httpBackend_) {
      serviceMock = ProgmanService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
 
  it('should make GET request when searching for tenants', inject(function(ProgmanService) {
      httpMock.expectGET(new RegExp('progman/tenant/component/name/myComponentName(.*)inGoodStanding=true&searchVal=mySearchVal&tenantType=STATE'))
              .respond(201,"http response");
      
      var returnedPromise = serviceMock.findTenantsByComponentAndSearchVal("myComponentName",true,"mySearchVal","STATE",{});
      returnedPromise.then(function(response) {
          expect(response.data).toBe("http response");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  }));
  
  it('should make correct GET request when searching for tenants 2', inject(function(ProgmanService) {
      httpMock.expectGET(new RegExp('progman/tenant/component/name/myComponentName(.*)inGoodStanding=true&page.page=4&page.size=15&page.sort=name&page.sort.dir=desc'))
              .respond(201,"http response");
      
      var pageableParams = { "page":"4", "pageSize":"15", "pageSort":"name", "pageSortDir":"desc" };
      var returnedPromise = serviceMock.findTenantsByComponentAndSearchVal("myComponentName",true,"","",pageableParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("http response");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  }));
  
  it('should make correct GET request when loading tenant types', inject(function(ProgmanService) {
      httpMock.expectGET(new RegExp('progman/tenantTypes(.*)')).respond(201,"http response");
      
      var returnedPromise = serviceMock.loadAllTenantTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe("http response");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  }));
  
});

