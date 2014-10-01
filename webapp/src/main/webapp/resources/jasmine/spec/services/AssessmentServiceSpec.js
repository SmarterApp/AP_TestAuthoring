describe('Assessment Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedAssessment = {
          "name" : "Test Assessment",
          "comment" : "assessment comment",
          "description" : "this is a test Assessment."
  };
  
  var existingAssessment = {
		  "id" : "assessment_id",
          "name" : "Test Assessment",
          "comment" : "assessment comment",
          "description" : "this is a test Assessment."
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
    
  beforeEach(inject(function(AssessmentService, _$httpBackend_) {
      serviceMock = AssessmentService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing assessment', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('assessment/assessment_id', {
          "id": "assessment_id",
          "name": "Test Assessment",
          "comment": "assessment comment",
          "description": "this is a test Assessment."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingAssessment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new assessment', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('assessment', {
          "name": "Test Assessment",
          "comment": "assessment comment",
          "description": "this is a test Assessment."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedAssessment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when searching for assessments', function() {
      var httpResponse = "found these assessments";
      httpMock.expectGET(new RegExp('assessment')).respond(201,httpResponse);
            
      var searchParams = { "name": "Math Assessment"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these assessments");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for assessments2', function() {
      var httpResponse = "found these assessments";
      httpMock.expectGET(new RegExp('assessment')).respond(201,httpResponse);
            
      var searchParams = { "name": "Test Assessment", "comment": "assessment comment", "description": "here's a description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these assessments");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing assessment', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('assessment/assessment_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingAssessment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('assessment/assessment_id', {
          "id": "assessment_id",
          "name": "Test Assessment",
          "comment": "assessment comment",
          "description": "this is a test Assessment."
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingAssessment);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

});
