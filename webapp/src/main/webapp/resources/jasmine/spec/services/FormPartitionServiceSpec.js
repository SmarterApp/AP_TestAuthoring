describe('Form Partition Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedFormPartition = {
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
  };
  
  var existingFormPartition = {
          "id" : "formPartition_id",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
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
    
  beforeEach(inject(function(FormPartitionService, _$httpBackend_) {
      serviceMock = FormPartitionService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing formPartition', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('formPartition/formPartition_id', {
          "id" : "formPartition_id",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingFormPartition);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new formPartition', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('formPartition', {
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedFormPartition);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by formPartition id', function() {
      httpMock.expectGET(new RegExp('formPartition/formPartition_id')).respond(201,existingFormPartition);
            
      var returnedPromise = serviceMock.findById("formPartition_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingFormPartition);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for formPartitions', function() {
      var httpResponse = "found these formPartitions";
      httpMock.expectGET(new RegExp('form(.*)&name=form-partition-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "form-partition-name"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these formPartitions");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for formPartitions2', function() {
      var httpResponse = "found these formPartitions";
      httpMock.expectGET(new RegExp('form(.*)&name=form-partition-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "form-partition-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these formPartitions");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing formPartition', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('formPartition/formPartition_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingFormPartition);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('formPartition/formPartition_id', {
          "id" : "formPartition_id",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingFormPartition);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});

