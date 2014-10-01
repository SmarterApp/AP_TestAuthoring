describe('Item Metadata Config Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedItemMetadataConfig = {
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
  };
  
  var existingItemMetadataConfig = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
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
    
  beforeEach(inject(function(ItemMetadataConfigService, _$httpBackend_) {
      serviceMock = ItemMetadataConfigService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make POST request when saving a new itemMetadataConfig', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('itemMetadataConfig', {
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedItemMetadataConfig);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by assessment id', function() {
      httpMock.expectGET(new RegExp('itemMetadataConfig/assessmentId/assessment_id')).respond(201,existingItemMetadataConfig);
            
      var returnedPromise = serviceMock.findByAssessmentId("assessment_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingItemMetadataConfig);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when saving an existing itemMetadataConfig', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('itemMetadataConfig/id_12345', {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemMetadataConfig);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('itemMetadataConfig/id_12345', {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemMetadataConfig);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing itemMetadataConfig', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('itemMetadataConfig/id_12345').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingItemMetadataConfig);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
});

