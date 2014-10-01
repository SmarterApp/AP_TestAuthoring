describe('PublishingRecordService', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var existingPublishingRecord = {
          "id" : "publishingRecord_id",
          "version" : "1.1",
          "purpose" : [ "REGISTRATION"],
          "status" : "INPROGRESS"
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
    
  beforeEach(inject(function(PublishingRecordService, _$httpBackend_) {
      serviceMock = PublishingRecordService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing publishingRecord', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('publishingRecord/publishingRecord_id', {
          "id" : "publishingRecord_id",
          "version" : "1.1",
          "purpose" : [ "REGISTRATION"],
          "status" : "INPROGRESS"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.update(existingPublishingRecord, false);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by publishingRecord id', function() {
      httpMock.expectGET(new RegExp('publishingRecord/publishingRecord_id')).respond(201,existingPublishingRecord);
            
      var returnedPromise = serviceMock.findById("publishingRecord_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingPublishingRecord);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for publishingRecords', function() {
      var httpResponse = "found these publishingRecords";
      httpMock.expectGET(new RegExp('publishingRecord(.*)&version=1.0')).respond(201,httpResponse);
            
      var searchParams = { "version": "1.0"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these publishingRecords");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for publishingRecords2', function() {
      var httpResponse = "found these publishingRecords";
      httpMock.expectGET(new RegExp('publishingRecord(.*)&version=1.1')).respond(201,httpResponse);
            
      var searchParams = { "version": "1.1" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these publishingRecords");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };
      httpMock.expectPUT('publishingRecord/publishingRecord_id', {
          "id" : "publishingRecord_id",
          "version" : "1.1",
          "purpose" : [ "REGISTRATION"],
          "status" : "INPROGRESS"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.update(existingPublishingRecord, false);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});
