describe('ReportingMeasure Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedReportingMeasure = {
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
  };
  
  var existingReportingMeasure = {
          "id" : "reportingMeasure_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
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
    
  beforeEach(inject(function(ReportingMeasureService, _$httpBackend_) {
      serviceMock = ReportingMeasureService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing reportingMeasure', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('reportingMeasure/reportingMeasure_id', {
          "id": "reportingMeasure_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingReportingMeasure);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new reportingMeasure', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('reportingMeasure', {
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedReportingMeasure);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by reportingMeasure id', function() {
      httpMock.expectGET(new RegExp('reportingMeasure/reportingMeasure_id')).respond(201,existingReportingMeasure);
            
      var returnedPromise = serviceMock.findById("reportingMeasure_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingReportingMeasure);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for reportingMeasures', function() {
      var httpResponse = "found these reportingMeasures";
      httpMock.expectGET(new RegExp('reportingMeasure(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these reportingMeasures");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for reportingMeasures2', function() {
      var httpResponse = "found these reportingMeasures";
      httpMock.expectGET(new RegExp('reportingMeasure(.*)&name=reportingMeasure-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "reportingMeasure-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these reportingMeasures");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing reportingMeasure', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('reportingMeasure/reportingMeasure_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingReportingMeasure);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('reportingMeasure/reportingMeasure_id', {
          "id": "reportingMeasure_id",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "blueprintReferenceType",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingReportingMeasure);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});

