describe('ApprovalService', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var existingPublishingRecord = {
          "id" : "publishingRecord_id",
          "version" : "1.1",
          "status" : "INPROGRESS"
        };
  
  var existingApproval = {
          "id" : "approval_id",
          "publishingRecordId" : "publishingRecord_id",
          "status" : "Pending"
        };
  
//  var expectedSpecificationTypes = [ "REGISTRATION", "ADMINISTRATION", "SCORING", "REPORTING", "SIMULATION", "COMPLETE" ];
  
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
    
  beforeEach(inject(function(ApprovalService, _$httpBackend_) {
      serviceMock = ApprovalService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should create initial approval objects', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('approval/approval_id', {
          "id" : "approval_id",
          "publishingRecordId" : "publishingRecord_id",
          "status" : "Pending"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.update(existingApproval);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when saving an existing approval', function() {
      httpMock.expectGET(new RegExp('approval/approval_id')).respond(201,existingApproval);
            
      var returnedPromise = serviceMock.findById("approval_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingApproval);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for approvals', function() {
      var httpResponse = "found these approvals";
      httpMock.expectGET(new RegExp('approval(.*)&publishingRecordId=publishingRecord_id')).respond(201,httpResponse);
            
      var searchParams = { "publishingRecordId": "publishingRecord_id"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these approvals");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for approvals2', function() {
      var httpResponse = "found these approvals";
      httpMock.expectGET(new RegExp('approval(.*)&publishingRecordId=publishingRecord_id2')).respond(201,httpResponse);
            
      var searchParams = { "publishingRecordId": "publishingRecord_id2" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these approvals");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('approval/approval_id', {
          "id" : "approval_id",
          "publishingRecordId" : "publishingRecord_id",
          "status" : "Pending"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.update(existingApproval);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

});
