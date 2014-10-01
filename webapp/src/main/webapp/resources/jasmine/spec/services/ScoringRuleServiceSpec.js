describe('ScoringRule Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedScoringRule = {
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
          "scoringRuleReferenceType" : "TEST",
		  "scoringRuleReferenceId" : "scoringRuleReferenceId",
          "parameters" : [ {
            "computationRuleParameterName" : "parameter1",
            "computationRuleParameterMultiplicity" : "DICTIONARY",
            "dictionaryValue" : [ {
              "key" : "parameterValueKey1",
              "value" : "1"
            }, {
              "key" : "parameterValueKey2",
              "value" : "2"
            } ]
          }, {
            "computationRuleParameterName" : "parameter2",
            "computationRuleParameterMultiplicity" : "SCALAR",
            "scalarValue" : "soleString"
          } ],
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
  };
  
  var existingScoringRule = {
          "id" : "scoringRule_id",
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
          "scoringRuleReferenceType" : "TEST",
		  "scoringRuleReferenceId" : "scoringRuleReferenceId",
          "parameters" : [ {
            "computationRuleParameterName" : "parameter1",
            "computationRuleParameterMultiplicity" : "DICTIONARY",
            "dictionaryValue" : [ {
              "key" : "parameterValueKey1",
              "value" : "1"
            }, {
              "key" : "parameterValueKey2",
              "value" : "2"
            } ]
          }, {
            "computationRuleParameterName" : "parameter2",
            "computationRuleParameterMultiplicity" : "SCALAR",
            "scalarValue" : "soleString"
          } ],
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
  };
  
  var expectedBlueprintReferenceTypes = [ "TEST", "SEGMENT", "AFFINITY_GROUP", "STANDARD" ];
  
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
    
  beforeEach(inject(function(ScoringRuleService, _$httpBackend_) {
      serviceMock = ScoringRuleService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing scoringRule', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('scoringRule/scoringRule_id', {
          "id": "scoringRule_id",
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
          "scoringRuleReferenceType" : "TEST",
		  "scoringRuleReferenceId" : "scoringRuleReferenceId",
          "parameters" : [ {
            "computationRuleParameterName" : "parameter1",
            "computationRuleParameterMultiplicity" : "DICTIONARY",
            "dictionaryValue" : [ {
              "key" : "parameterValueKey1",
              "value" : "1"
            }, {
              "key" : "parameterValueKey2",
              "value" : "2"
            } ]
          }, {
            "computationRuleParameterName" : "parameter2",
            "computationRuleParameterMultiplicity" : "SCALAR",
            "scalarValue" : "soleString"
          } ],
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingScoringRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new scoringRule', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('scoringRule', {
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
          "scoringRuleReferenceType" : "TEST",
		  "scoringRuleReferenceId" : "scoringRuleReferenceId",
          "parameters" : [ {
            "computationRuleParameterName" : "parameter1",
            "computationRuleParameterMultiplicity" : "DICTIONARY",
            "dictionaryValue" : [ {
              "key" : "parameterValueKey1",
              "value" : "1"
            }, {
              "key" : "parameterValueKey2",
              "value" : "2"
            } ]
          }, {
            "computationRuleParameterName" : "parameter2",
            "computationRuleParameterMultiplicity" : "SCALAR",
            "scalarValue" : "soleString"
          } ],
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedScoringRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by scoringRule id', function() {
      httpMock.expectGET(new RegExp('scoringRule/scoringRule_id')).respond(201,existingScoringRule);
            
      var returnedPromise = serviceMock.findById("scoringRule_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingScoringRule);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for scoringRules', function() {
      var httpResponse = "found these scoringRules";
      httpMock.expectGET(new RegExp('scoringRule(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these scoringRules");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for scoringRules2', function() {
      var httpResponse = "found these scoringRules";
      httpMock.expectGET(new RegExp('scoringRule(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these scoringRules");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing scoringRule', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('scoringRule/scoringRule_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingScoringRule);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('scoringRule/scoringRule_id', {
          "id": "scoringRule_id",
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
          "scoringRuleReferenceType" : "TEST",
		  "scoringRuleReferenceId" : "scoringRuleReferenceId",
          "parameters" : [ {
            "computationRuleParameterName" : "parameter1",
            "computationRuleParameterMultiplicity" : "DICTIONARY",
            "dictionaryValue" : [ {
              "key" : "parameterValueKey1",
              "value" : "1"
            }, {
              "key" : "parameterValueKey2",
              "value" : "2"
            } ]
          }, {
            "computationRuleParameterName" : "parameter2",
            "computationRuleParameterMultiplicity" : "SCALAR",
            "scalarValue" : "soleString"
          } ],
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingScoringRule);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  it('should make PUT request when updateCollection() called', function() {
      var httpResponse = "successful PUT";

      var scoringRuleList = [];

      httpMock.expectPUT('scoringRule', scoringRuleList).respond(201,httpResponse);

      var returnedPromise = serviceMock.updateCollection(scoringRuleList);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle error after updateCollection()', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };
      
      var scoringRuleList = [];
      
      httpMock.expectPUT('scoringRule', scoringRuleList).respond(501,httpResponse);
            
      var returnedPromise = serviceMock.updateCollection(scoringRuleList);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });

  it('should make correct GET request when retrieving blueprintReferenceTypes', function() {
      httpMock.expectGET(new RegExp('scoringRule/blueprintReferenceTypes')).respond(201,expectedBlueprintReferenceTypes);

      var returnedPromise = serviceMock.getBlueprintReferenceTypes();
      returnedPromise.then(function(response) {
          expect(response.data).toBe(expectedBlueprintReferenceTypes);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
});

