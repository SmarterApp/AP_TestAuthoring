describe('ItemGroup Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedItemGroup = {
		  "assessmentId" : "assessmentId",
		  "locationType" : "locationType",
		  "locationId" : "locationId",
		  "groupName" : "groupName"
  };
  
  var existingItemGroup = {
          "id" : "itemGroup_id",
		  "assessmentId" : "assessmentId",
		  "locationType" : "locationType",
		  "locationId" : "locationId",
		  "groupName" : "groupName"
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
    
  beforeEach(inject(function(ItemGroupService, _$httpBackend_) {
      serviceMock = ItemGroupService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing itemGroup', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('itemGroup/itemGroup_id', {
          "id": "itemGroup_id",
		  "assessmentId" : "assessmentId",
		  "locationType" : "locationType",
		  "locationId" : "locationId",
		  "groupName" : "groupName"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new itemGroup', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('itemGroup', {
		  "assessmentId" : "assessmentId",
		  "assessmentId" : "assessmentId",
		  "locationType" : "locationType",
		  "locationId" : "locationId",
		  "groupName" : "groupName"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedItemGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by itemGroup id', function() {
      httpMock.expectGET(new RegExp('itemGroup/itemGroup_id')).respond(201,existingItemGroup);
            
      var returnedPromise = serviceMock.findById("itemGroup_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingItemGroup);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for itemGroups', function() {
      var httpResponse = "found these itemGroups";
      httpMock.expectGET(new RegExp('itemGroup(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these itemGroups");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for itemGroups2', function() {
      var httpResponse = "found these itemGroups";
      httpMock.expectGET(new RegExp('itemGroup(.*)&name=itemGroup-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "itemGroup-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these itemGroups");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing itemGroup', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('itemGroup/itemGroup_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingItemGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('itemGroup/itemGroup_id', {
          "id": "itemGroup_id",
		  "assessmentId" : "assessmentId",
		  "locationType" : "locationType",
		  "locationId" : "locationId",
		  "groupName" : "groupName"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemGroup);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});

