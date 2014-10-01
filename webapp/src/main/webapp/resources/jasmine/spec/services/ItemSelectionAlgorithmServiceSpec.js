
describe('ItemSelectionAlgorithm Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedItemSelectionAlgorithm = {
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
  };
  
  var existingItemSelectionAlgorithm = {
          "id" : "itemSelectionAlgorithm_id",
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
  };
  
  var expectedItemSelectionAlgorithmTypes = [ "FIXEDFORM", "ADAPTIVE" ];
  var expectedItemSelectionPurposes = [ "SCALAR", "BLUEPRINT" ];
  var expectedItemSelectionTypes = [ "BOOLEAN", "INTEGER", "FLOAT", "LIST" ];
  
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
    
  beforeEach(inject(function(ItemSelectionAlgorithmService, _$httpBackend_) {
      serviceMock = ItemSelectionAlgorithmService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing itemSelectionAlgorithm', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('itemSelectionAlgorithm/itemSelectionAlgorithm_id', {
          "id": "itemSelectionAlgorithm_id",
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemSelectionAlgorithm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new itemSelectionAlgorithm', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('itemSelectionAlgorithm', {
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedItemSelectionAlgorithm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by itemSelectionAlgorithm id', function() {
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm/itemSelectionAlgorithm_id')).respond(201,existingItemSelectionAlgorithm);
            
      var returnedPromise = serviceMock.findById("itemSelectionAlgorithm_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingItemSelectionAlgorithm);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for itemSelectionAlgorithms', function() {
      var httpResponse = "found these itemSelectionAlgorithms";
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm(.*)&name=item-sel-algo-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "item-sel-algo-name"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these itemSelectionAlgorithms");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for itemSelectionAlgorithms2', function() {
      var httpResponse = "found these itemSelectionAlgorithms";
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm(.*)&description=some-description&name=item-sel-algo-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "item-sel-algo-name", "description": "some-description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these itemSelectionAlgorithms");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing itemSelectionAlgorithm', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('itemSelectionAlgorithm/itemSelectionAlgorithm_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingItemSelectionAlgorithm);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('itemSelectionAlgorithm/itemSelectionAlgorithm_id', {
          "id": "itemSelectionAlgorithm_id",
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingItemSelectionAlgorithm);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving itemSelectionAlgorithmTypes', function() {
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm/itemSelectionAlgorithmTypes')).respond(201,expectedItemSelectionAlgorithmTypes);
            
      var returnedPromise = serviceMock.getItemSelectionAlgorithmTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedItemSelectionAlgorithmTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving itemSelectionPurposes', function() {
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm/itemSelectionPurposes')).respond(201,expectedItemSelectionPurposes);
            
      var returnedPromise = serviceMock.getItemSelectionPurposes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedItemSelectionPurposes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving itemSelectionTypes', function() {
      httpMock.expectGET(new RegExp('itemSelectionAlgorithm/itemSelectionTypes')).respond(201,expectedItemSelectionTypes);
            
      var returnedPromise = serviceMock.getItemSelectionTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedItemSelectionTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
});

