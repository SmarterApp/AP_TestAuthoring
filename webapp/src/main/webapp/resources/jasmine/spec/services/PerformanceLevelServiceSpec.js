describe('PerformanceLevel Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedPerformanceLevel = {
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "performanceLevelValues" : [ "performanceLevelValue1", "performanceLevelValue2"]
  };
  
  var existingPerformanceLevel = {
          "id" : "performanceLevel_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "performanceLevelValues" : [ "performanceLevelValue1", "performanceLevelValue2"]
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
    
  beforeEach(inject(function(PerformanceLevelService, _$httpBackend_) {
      serviceMock = PerformanceLevelService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing performanceLevel', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('performanceLevel/performanceLevel_id', {
          "id": "performanceLevel_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "performanceLevelValues" : [ "performanceLevelValue1", "performanceLevelValue2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingPerformanceLevel);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new performanceLevel', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('performanceLevel', {
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "performanceLevelValues" : [ "performanceLevelValue1", "performanceLevelValue2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedPerformanceLevel);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by performanceLevel id', function() {
      httpMock.expectGET(new RegExp('performanceLevel/performanceLevel_id')).respond(201,existingPerformanceLevel);
            
      var returnedPromise = serviceMock.findById("performanceLevel_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingPerformanceLevel);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for performanceLevels', function() {
      var httpResponse = "found these performanceLevels";
      httpMock.expectGET(new RegExp('performanceLevel(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these performanceLevels");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for performanceLevels2', function() {
      var httpResponse = "found these performanceLevels";
      httpMock.expectGET(new RegExp('performanceLevel(.*)&name=performanceLevel-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "performanceLevel-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these performanceLevels");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing performanceLevel', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('performanceLevel/performanceLevel_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingPerformanceLevel);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('performanceLevel/performanceLevel_id', {
          "id": "performanceLevel_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "performanceLevelValues" : [ "performanceLevelValue1", "performanceLevelValue2"]
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingPerformanceLevel);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});

