describe('Blueprint Element Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedBlueprintElement = {
          "assessmentId" : "myParentId",
          "standardKey" : "standard-key-1",
          "level" : "level1",
          "grade" : "1",
          "textDescription" : "textDescription",
          "active" : "true",
          "blueprintElementValueMap" : { "MASTER" : {
              "operationalItemMinValue" : "1",
              "operationalItemMaxValue" : "15",
              "fieldTestItemMinValue" : "10",
              "fieldTestItemMaxValue" : "20" }}
  };
  
  var existingBlueprintElement = {
          "id" : "blueprintElement_id",
          "assessmentId" : "myParentId",
          "standardKey" : "standard-key-1",
          "level" : "level1",
          "grade" : "1",
          "textDescription" : "textDescription",
          "active" : "true",
          "blueprintElementValueMap" : { "MASTER" : {
              "operationalItemMinValue" : "1",
              "operationalItemMaxValue" : "15",
              "fieldTestItemMinValue" : "10",
              "fieldTestItemMaxValue" : "20" }}
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
    
  beforeEach(inject(function(BlueprintElementService, _$httpBackend_) {
      serviceMock = BlueprintElementService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing blueprintElement', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/blueprintElement_id', {
          "id": "blueprintElement_id",
          "assessmentId" : "myParentId",
          "standardKey" : "standard-key-1",
          "level" : "level1",
          "grade" : "1",
          "textDescription" : "textDescription",
          "active" : "true",
          "blueprintElementValueMap" : { "MASTER" : {
              "operationalItemMinValue" : "1",
              "operationalItemMaxValue" : "15",
              "fieldTestItemMinValue" : "10",
              "fieldTestItemMaxValue" : "20" }}
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingBlueprintElement);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new blueprintElement', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('blueprintElement', {
          "assessmentId" : "myParentId",
          "standardKey" : "standard-key-1",
          "level" : "level1",
          "grade" : "1",
          "textDescription" : "textDescription",
          "active" : "true",
          "blueprintElementValueMap" : { "MASTER" : {
              "operationalItemMinValue" : "1",
              "operationalItemMaxValue" : "15",
              "fieldTestItemMinValue" : "10",
              "fieldTestItemMaxValue" : "20" }}
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedBlueprintElement);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by blueprintElement id', function() {
      httpMock.expectGET(new RegExp('blueprintElement/blueprintElement_id')).respond(201,existingBlueprintElement);
            
      var returnedPromise = serviceMock.findById("blueprintElement_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingBlueprintElement);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for blueprintElements', function() {
      var httpResponse = "found these blueprintElements";
      httpMock.expectGET(new RegExp('blueprintElement')).respond(201,httpResponse);
            
      var searchParams = { "standardKey": "Mathematics BlueprintElement"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these blueprintElements");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for blueprintElements2', function() {
      var httpResponse = "found these blueprintElements";
      httpMock.expectGET(new RegExp('blueprintElement')).respond(201,httpResponse);

      var searchParams = { "standardKey": "Mathematics BlueprintElement", "operationalItemMinValue": "1", "operationalItemMaxValue": "99" };
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these blueprintElements");
          expect(response.errors).toEqual([]);
      });

      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing blueprintElement', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('blueprintElement/blueprintElement_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingBlueprintElement);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('blueprintElement/blueprintElement_id', {
          "id": "blueprintElement_id",
          "assessmentId" : "myParentId",
          "standardKey" : "standard-key-1",
          "level" : "level1",
          "grade" : "1",
          "textDescription" : "textDescription",
          "active" : "true",
          "blueprintElementValueMap" : { "MASTER" : {
              "operationalItemMinValue" : "1",
              "operationalItemMaxValue" : "15",
              "fieldTestItemMinValue" : "10",
              "fieldTestItemMaxValue" : "20" }}
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingBlueprintElement);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when synchronizing with core standards', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/myParentId/synch', []).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.synchWithCoreStandards("myParentId");
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when activating blueprint element grades', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/myParentId/activate?active=true&grades=1&grades=5&grades=6', []).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.activateBpElementGrades("myParentId",["1","5","6"],true);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when adding segment blueprint without clone', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/myParentId/segment/segment-id/add', []).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.addSegmentToBlueprintElementData("myParentId","segment-id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when adding segment blueprint with clone', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/myParentId/segment/segment-id/add?segmentIdToClone=segment-id-to-clone', []).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.addSegmentToBlueprintElementData("myParentId","segment-id","segment-id-to-clone");
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
    
  it('should make PUT request when clearing blueprint', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('blueprintElement/myParentId/clear?segmentId=segment-id', []).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.clearBlueprint("myParentId","segment-id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when updateCollection() called', function() {
      var httpResponse = "successful PUT";
      
      var bpElementList = [];
      var data = { "blueprintElements" : bpElementList };
      
      httpMock.expectPUT('blueprintElement', data).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.updateCollection(bpElementList);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle error after updateCollection()', function() {
      var httpResponse = { "messages": { "blueprintElements[0].blueprintElementValueMap[MASTER].opMin" : [ "error-msg" ] } };
      
      var bpElementList = [];
      var data = { "blueprintElements" : bpElementList };
      
      httpMock.expectPUT('blueprintElement', data).respond(501,httpResponse);
            
      var returnedPromise = serviceMock.updateCollection(bpElementList);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([{ "blueprintIndex":"0", "segmentId":"MASTER", "fieldName":"opMin", "message":"error-msg" }]);
      });
      
      httpMock.flush();
  });
  
  it('should handle multiple errors after updateCollection()', function() {
      var httpResponse = {
          "messages" : {
              "blueprintElements[3].otherField" : [ "abc" ],
              "blueprintElements[0].blueprintElementValueMap[MASTER].fieldTestItemMaxValue" : [ "error1" ],
              "blueprintElements[0].blueprintElementValueMap[MASTER].fieldTestItemMinValue" : [ "error2" ],
              "blueprintElements[0].blueprintElementValueMap[MASTER].operationalItemMaxValue" : [ "error3" ],
              "blueprintElements[0].blueprintElementValueMap[MASTER].operationalItemMinValue" : [ "error4" ],
              "blueprintElements[2].blueprintElementValueMap[MASTER].operationalItemMinValue" : [ "error5" ]
        }
      };
      
      var expectedBpErrorList = [
          { "blueprintIndex":"3", "segmentId":null, "fieldName":"otherField", "message":"abc" },
          { "blueprintIndex":"0", "segmentId":"MASTER", "fieldName":"fieldTestItemMaxValue", "message":"error1" },
          { "blueprintIndex":"0", "segmentId":"MASTER", "fieldName":"fieldTestItemMinValue", "message":"error2" },
          { "blueprintIndex":"0", "segmentId":"MASTER", "fieldName":"operationalItemMaxValue", "message":"error3" },
          { "blueprintIndex":"0", "segmentId":"MASTER", "fieldName":"operationalItemMinValue", "message":"error4" },
          { "blueprintIndex":"2", "segmentId":"MASTER", "fieldName":"operationalItemMinValue", "message":"error5" }
      ];
      
      var bpElementList = [];
      var data = { "blueprintElements" : bpElementList };
      
      httpMock.expectPUT('blueprintElement', data).respond(501,httpResponse);
            
      var returnedPromise = serviceMock.updateCollection(bpElementList);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual( expectedBpErrorList );
      });
      
      httpMock.flush();
  });
  
});

