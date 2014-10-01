describe('ComputationRule Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedComputationRule = {
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "computationRuleType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "computationRuleMultiplicityType" : "DICTIONARY",
          "dictionaryIndexType" : "INTEGER" }
  };
  
  var existingComputationRule = {
          "id" : "computationRule_id",
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "computationRuleType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "computationRuleMultiplicityType" : "DICTIONARY",
          "dictionaryIndexType" : "INTEGER" }
  };
  
  var expectedConversionTableTypes = [ "VALUE", "ERROR", "BOTH", "NONE" ];
  var expectedComputationRuleTypes = [ "FLOAT", "INTEGER", "STRING" ];
  var expectedComputationRuleMultiplicityTypes = [ "DICTIONARY", "SCALAR" ];
  var expectedDictionaryIndexTypes = [ "INTEGER", "STRING" ];
  
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
    
  beforeEach(inject(function(ComputationRuleService, _$httpBackend_) {
      serviceMock = ComputationRuleService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing computationRule', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('computationRule/computationRule_id', {
          "id": "computationRule_id",
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "computationRuleType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "computationRuleMultiplicityType" : "DICTIONARY",
          "dictionaryIndexType" : "INTEGER" }
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingComputationRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new computationRule', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('computationRule', {
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "computationRuleType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "computationRuleMultiplicityType" : "DICTIONARY",
          "dictionaryIndexType" : "INTEGER" }
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedComputationRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by computationRule id', function() {
      httpMock.expectGET(new RegExp('computationRule/computationRule_id')).respond(201,existingComputationRule);
            
      var returnedPromise = serviceMock.findById("computationRule_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingComputationRule);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for computationRules', function() {
      var httpResponse = "found these computationRules";
      httpMock.expectGET(new RegExp('computationRule(.*)&name=comp-rule-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "comp-rule-name"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these computationRules");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for computationRules2', function() {
      var httpResponse = "found these computationRules";
      httpMock.expectGET(new RegExp('computationRule(.*)&description=here\'s(.+)a(.+)description&name=comp-rule-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "comp-rule-name", "description": "here's a description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these computationRules");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing computationRule', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('computationRule/computationRule_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingComputationRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('computationRule/computationRule_id', {
          "id": "computationRule_id",
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "computationRuleType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "computationRuleMultiplicityType" : "DICTIONARY",
          "dictionaryIndexType" : "INTEGER" }
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingComputationRule);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving conversionTableTypes', function() {
      httpMock.expectGET(new RegExp('computationRule/conversionTableTypes')).respond(201,expectedConversionTableTypes);

      var returnedPromise = serviceMock.getConversionTableTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedConversionTableTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving computationRuleTypes', function() {
      httpMock.expectGET(new RegExp('computationRule/computationRuleTypes')).respond(201,expectedComputationRuleTypes);
            
      var returnedPromise = serviceMock.getComputationRuleTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedComputationRuleTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving computationRuleMultiplicityTypes', function() {
      httpMock.expectGET(new RegExp('computationRule/computationRuleMultiplicityTypes')).respond(201,expectedComputationRuleMultiplicityTypes);
            
      var returnedPromise = serviceMock.getComputationRuleMultiplicityTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedComputationRuleMultiplicityTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving dictionaryIndexTypes', function() {
      httpMock.expectGET(new RegExp('computationRule/dictionaryIndexTypes')).respond(201,expectedDictionaryIndexTypes);
            
      var returnedPromise = serviceMock.getDictionaryIndexTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedDictionaryIndexTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
});

