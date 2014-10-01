describe('Subject Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedSubject = {
          "name" : "Mathematics",
          "abbreviation" : "MATH",
          "description" : "This is a course about numbers."
  };
  
  var existingSubject = {
          "id" : "subject_id",
          "name" : "Mathematics",
          "abbreviation" : "MATH",
          "description" : "This is a course about numbers."
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
    
  beforeEach(inject(function(SubjectService, _$httpBackend_) {
      serviceMock = SubjectService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing subject', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('subject/subject_id', {
          "id": "subject_id",
          "name": "Mathematics",
          "abbreviation": "MATH",
          "description": "This is a course about numbers."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingSubject);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new subject', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('subject', {
          "name": "Mathematics",
          "abbreviation": "MATH",
          "description": "This is a course about numbers."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedSubject);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by subject id', function() {
      httpMock.expectGET(new RegExp('subject/subject_id')).respond(201,existingSubject);
            
      var returnedPromise = serviceMock.findById("subject_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingSubject);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for subjects', function() {
      var httpResponse = "found these subjects";
      httpMock.expectGET(new RegExp('subject(.*)&name=Mathematics')).respond(201,httpResponse);
            
      var searchParams = { "name": "Mathematics"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these subjects");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for subjects2', function() {
      var httpResponse = "found these subjects";
      httpMock.expectGET(new RegExp('subject(.*)&abbreviation=MATH&description=here\'s(.+)a(.+)description&name=Mathematics')).respond(201,httpResponse);
            
      var searchParams = { "name": "Mathematics", "abbreviation": "MATH", "description": "here\'s a description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these subjects");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct retire request when retiring subject', function() {
      httpMock.expectPUT('subject/subject_id/retire').respond(existingSubject);
            
      var returnedPromise = serviceMock.retireSubject(existingSubject.id);
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingSubject);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('subject/subject_id', {
          "id": "subject_id",
          "name": "Mathematics",
          "abbreviation": "MATH",
          "description": "This is a course about numbers."
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingSubject);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  
  
});

