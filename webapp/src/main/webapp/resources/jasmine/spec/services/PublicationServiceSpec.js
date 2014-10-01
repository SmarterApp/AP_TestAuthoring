describe('Publication Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var subject = {
		  "name": "Mathematics", 
		  "abbreviation": "MATH",
		  "description": "This is a course about numbers."
  };
  
  var unsavedPublication = {
          "name" : "Math Publication",
          "subject" : subject,
          "description" : "Publication of Mathematics."
  };
  
  var existingPublication = {
		  "id" : "publication_id",
          "name" : "Math Publication",
          "subject" : subject,
          "description" : "Publication of Mathematics."
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
    
  beforeEach(inject(function(PublicationService, _$httpBackend_) {
      serviceMock = PublicationService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing publication', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('publication/publication_id', {
          "id": "publication_id",
          "name": "Math Publication",
          "subject": subject,
          "description": "Publication of Mathematics."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingPublication);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new publication', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('publication', {
          "name": "Math Publication",
          "subject": subject,
          "description": "Publication of Mathematics."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedPublication);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by publication id', function() {
      httpMock.expectGET(new RegExp('publication/publication_id')).respond(201,existingPublication);
            
      var returnedPromise = serviceMock.findById("publication_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingPublication);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for publications', function() {
      var httpResponse = "found these publications";
      httpMock.expectGET(new RegExp('publication')).respond(201,httpResponse);
            
      var searchParams = { "name": "Math Publication"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these publications");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for publications2', function() {
      var httpResponse = "found these publications";
      httpMock.expectGET(new RegExp('publication')).respond(201,httpResponse);
            
      var searchParams = { "name": "Math Publication", "subject": subject, "description": "here's a description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these publications");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing publication', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('publication/publication_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingPublication);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('publication/publication_id', {
          "id": "publication_id",
          "name": "Math Publication",
          "subject": subject,
          "description": "Publication of Mathematics."
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingPublication);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
});
