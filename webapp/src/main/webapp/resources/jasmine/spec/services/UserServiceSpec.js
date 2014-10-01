describe('User Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var userAssets = {
			  "id" : "526587cae4b0fb61cee18114",
			  "tenant" : {
			    "id" : "524af61ae4b0b02763aa0fe0",
			    "name" : "WI",
			    "description" : "State Of Wisconsin",
			    "type" : "STATE",
			    "tenantSubscriptions" : null,
			    "url" : "/tenant/524af61ae4b0b02763aa0fe0"
			  },
			  "component" : {
			    "id" : "525ed008e4b0b4751d01909f",
			    "name" : "TestAuthoring",
			    "url" : "/component/525ed008e4b0b4751d01909f"
			  },
			  "assets" : [ {
			    "name" : "logo",
			    "type" : "IMAGE",
			    "property" : "/assetPool/assetFile/524b00bfe4b0b02763aa7be2/fat_eddie.png",
			    "assetFileGridId" : "524b00bfe4b0b02763aa7be2",
			    "assetFileName" : "fat_eddie.png",
			    "fileContentType" : null,
			    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
			    "url" : "http://sb11-progman-qa.drc-ec2.com/rest//assetPool/assetFile/524b00bfe4b0b02763aa7be2/fat_eddie.png"
			  }, {
			    "name" : "headerbackground",
			    "type" : "PROPERTY",
			    "property" : "green",
			    "assetFileGridId" : null,
			    "assetFileName" : null,
			    "fileContentType" : null,
			    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
			    "url" : "http://sb11-progman-qa.drc-ec2.com/rest/green"
			  } ],
			  "url" : "/assetGroup/526587cae4b0fb61cee18114"
  };
  
  
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
    
  beforeEach(inject(function(UserService, _$httpBackend_) {
      serviceMock = UserService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make correct GET request when getting user assets', function() {
      httpMock.expectGET(/^user\/assets/).respond(201,userAssets);
      var returnedPromise = serviceMock.getAssets("arodgers");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(userAssets);
          expect(response.errors).toEqual([]);
      });
      httpMock.flush();
  });
  
  
  
});

