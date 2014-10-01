describe('FileGroup Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedFileGroup = {
		  "simulationRecordId" : "simulationRecordId",
		  "name" : "name",
		  "createDate" : "1234680459"
  };
  
  var existingFileGroup = {
          "id" : "fileGroup_id",
		  "simulationRecordId" : "simulationRecordId",
		  "name" : "name",
		  "createDate" : "1234680459"
  };
  
  var unsavedSimulationRecord = {
		  "assessmentId" : "assessmentId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
  };
  
  var existingSimulationRecord = {
          "id" : "simulationRecord_id",
		  "assessmentId" : "assessmentId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
  };
  
  var unsavedPsychometricRecord = {
		  "publishingRecordId" : "publishingRecordId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
  };
  
  var existingPsychometricRecord = {
          "id" : "psychometricRecord_id",
		  "publishingRecordId" : "publishingRecordId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
  };
  
  var existingGridFile = {
          "gridFsId" : "gridFsFile_id",
		  "content" : "content"
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
    
  beforeEach(inject(function(FileGroupService, _$httpBackend_) {
      serviceMock = FileGroupService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing fileGroup', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('fileGroup/fileGroup_id', {
          "id": "fileGroup_id",
		  "simulationRecordId" : "simulationRecordId",
		  "name" : "name",
		  "createDate" : "1234680459"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingFileGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new fileGroup', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('fileGroup', {
		  "simulationRecordId" : "simulationRecordId",
		  "name" : "name",
		  "createDate" : "1234680459"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedFileGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by fileGroup id', function() {
      httpMock.expectGET(new RegExp('fileGroup/fileGroup_id')).respond(201,existingFileGroup);
            
      var returnedPromise = serviceMock.findById("fileGroup_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingFileGroup);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for fileGroups', function() {
      var httpResponse = "found these fileGroups";
      httpMock.expectGET(new RegExp('fileGroup(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these fileGroups");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for fileGroups2', function() {
      var httpResponse = "found these fileGroups";
      httpMock.expectGET(new RegExp('fileGroup(.*)&name=fileGroup-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "fileGroup-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these fileGroups");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing fileGroup', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('fileGroup/fileGroup_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingFileGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('fileGroup/fileGroup_id', {
          "id": "fileGroup_id",
		  "simulationRecordId" : "simulationRecordId",
		  "name" : "name",
		  "createDate" : "1234680459"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingFileGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing gridFile', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('fileGroup/gridFsFile/gridFsFile_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.removeGridFile(existingGridFile);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding simulationRecord by assessment id', function() {
      httpMock.expectGET(new RegExp('fileGroup/simulationRecord/assessment_id')).respond(201,existingSimulationRecord);
            
      var returnedPromise = serviceMock.getSimulationRecordByAssessmentId("assessment_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingSimulationRecord);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when saving an existing simulationRecord', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('fileGroup/simulationRecord/simulationRecord_id', {
          "id" : "simulationRecord_id",
		  "assessmentId" : "assessmentId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.updateSimulationRecord(existingSimulationRecord);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new simulationRecord', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('fileGroup/simulationRecord', {
		  "assessmentId" : "assessmentId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.createSimulationRecord(unsavedSimulationRecord);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding psychometricRecord by publishingRecord id', function() {
      httpMock.expectGET(new RegExp('fileGroup/psychometricRecord/publishingRecord_id')).respond(201,existingPsychometricRecord);
            
      var returnedPromise = serviceMock.getPsychometricRecordByPublishingRecordId("publishingRecord_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingPsychometricRecord);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when saving an existing psychometricRecord', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('fileGroup/psychometricRecord/psychometricRecord_id', {
          "id" : "psychometricRecord_id",
		  "publishingRecordId" : "publishingRecordId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.updatePsychometricRecord(existingPsychometricRecord);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new psychometricRecord', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('fileGroup/psychometricRecord', {
		  "publishingRecordId" : "publishingRecordId",
		  "version" : "1.0",
		  "lastUploadDate" : "6723468956"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.createPsychometricRecord(unsavedPsychometricRecord);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding psychometricRecord versions by assessment id', function() {
      httpMock.expectGET(new RegExp('fileGroup/psychometricRecordVersions/assessmentId')).respond(201,existingPsychometricRecord);
            
      var returnedPromise = serviceMock.getPsychometricRecordVersions("assessmentId");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingPsychometricRecord);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
});

