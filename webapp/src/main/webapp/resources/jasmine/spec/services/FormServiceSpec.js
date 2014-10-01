describe('Form Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedForm = {
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
  };
  
  var existingForm = {
          "id" : "form_id",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
  };
  
  var expectedLanguages = [{ "key" : "eng", "value" : "English"}, { "key" : "spa", "value" : "Spanish; Castilian" }];
  
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
    
  beforeEach(inject(function(FormService, _$httpBackend_) {
      serviceMock = FormService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing form', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('form/form_id', {
          "id": "form_id",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingForm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new form', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('form', {
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedForm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by form id', function() {
      httpMock.expectGET(new RegExp('form/form_id')).respond(201,existingForm);
            
      var returnedPromise = serviceMock.findById("form_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingForm);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for forms', function() {
      var httpResponse = "found these forms";
      httpMock.expectGET(new RegExp('form(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these forms");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for forms2', function() {
      var httpResponse = "found these forms";
      httpMock.expectGET(new RegExp('form(.*)&name=form-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "form-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these forms");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing form', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('form/form_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingForm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('form/form_id', {
          "id": "form_id",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingForm);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving languages', function() {
      httpMock.expectGET(new RegExp('form/languages')).respond(201,expectedLanguages);

      var returnedPromise = serviceMock.getLanguages();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedLanguages);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
});

