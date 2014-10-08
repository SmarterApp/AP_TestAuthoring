describe('AssessmentScoringRuleController ', function() {
  var scope = null;
  var state = null;
  var scoringRuleService = null;
  var windowMock = null;
  var q = null;
  
  var savedScoringRule = {
          "id" : "id_12345",
		  "assessmentId" : "assessment_id",
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
          "scoringRuleReferenceName" : "1hYUIPCyAl",
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
        };
  
  var savedScoringRule2 = {
          "id" : "id_67890",
		  "assessmentId" : "assessment_id",
		  "order" : 2,
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
          "scoringRuleReferenceName" : "1hYUIPCyAl",
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
        }; 
  
  var savedScoringRule3 = {
          "id" : "id_98765",
		  "assessmentId" : "assessment_id",
		  "order" : 3,
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
          "scoringRuleReferenceName" : "1hYUIPCyAl",
          "valueConversionTable" : "UkFOR0VfTkFNRSxTVEFSVF9WQUxVRQp5dWdvLDAKZXNjb3J0LDMwCmNhbXJ5LDY1Cm1hc2VyYXRpLDg4"
        }; 
    
  //you need to indicate your module in a test  
  beforeEach(module('testauth', function($provide) {
      return $provide.decorator('$state', function () {
          return {
              transitionTo: function (path) {
                  return {};
              },
          };
      });
  }));
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ScoringRuleService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Scoring Rules", select:"assessmenthome.scoringrule", active:false }];
        scope.tabIndexes = {SCORINGRULE:0};

        var mockForm = {};
        mockForm.$setPristine = function(){};
        scope.scoringRuleForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        scoringRuleService = ScoringRuleService;
        
        // create controller
        $controller('AssessmentScoringRuleController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: {id : "assessment_id"} },
            loadedBlueprintReferenceTypes: {data:{"searchResults" : []}, errors:[]},
            loadedBlueprintReferences: {data: []},
            scoringRuleService: ScoringRuleService
      });
        
  }));
  
  it('deletes scoringRule by calling service and removing from search results', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(scoringRuleService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      httpMock.expectDELETE(/^scoringRule/).respond("");
      scope.remove(savedScoringRule);
      httpMock.flush();
      
      expect(scoringRuleService.remove).toHaveBeenCalledWith(savedScoringRule);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-scoringrule-search');
  });
  
  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(scoringRuleService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedScoringRule, savedScoringRule2 ];
      httpMock.expectDELETE(/^scoringRule/).respond(400, {"messages" : {"scoringRuleId" : [ "Invalid Scoring Rule ID." ] } });
      
      scope.remove(savedScoringRule2);
      httpMock.flush();
      
      expect(scoringRuleService.remove).toHaveBeenCalledWith(savedScoringRule2);
      expect(scope.errors).toEqual( [ "Invalid Scoring Rule ID." ] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-scoringrule-search');
      expect(scope.searchResponse.searchResults.length).toBe(2);
      expect(scope.searchResponse.searchResults).toContain( savedScoringRule );
  });
  
  it('reorders scoringRule list by calling service to save reordered search results', function() {
      spyOn(scoringRuleService, "updateCollection").andCallThrough();

      scope.searchResponse = {};
      reorderedList = [ savedScoringRule, savedScoringRule2, savedScoringRule3 ];
      scope.searchResponse.searchResults = [ savedScoringRule, savedScoringRule2, savedScoringRule3 ];
      
      httpMock.expectPUT(/^scoringRule/).respond(savedScoringRule);
      
      scope.saveOrder();
      httpMock.flush();
      
      expect(scoringRuleService.updateCollection).toHaveBeenCalledWith(reorderedList);
      expect(scope.errors.length).toBe(0);
      expect(scope.searchResponse.searchResults.length).toBe(3);
  });
  
  it('handles reorder errors correctly', function() {
      spyOn(scoringRuleService, "updateCollection").andCallThrough();

      scope.searchResponse = {};
      reorderedList = [ savedScoringRule, savedScoringRule2 ];
      scope.searchResponse.searchResults = [ savedScoringRule, savedScoringRule2 ];
      
      httpMock.expectPUT(/^scoringRule/).respond(400, {"messages" : {"scoringRuleExists" : [ "Scoring Rule already exists in this assessment for order: " + savedScoringRule.order ] } });
      
      scope.saveOrder();
      httpMock.flush();
      
      expect(scoringRuleService.updateCollection).toHaveBeenCalledWith(reorderedList);
      expect(scope.errors).toEqual( [ "Scoring Rule already exists in this assessment for order: " + savedScoringRule.order ] );
      expect(scope.searchResponse.searchResults.length).toBe(2);
  });
  
  it('searches scoringRules by calling service', function(){
      spyOn(scoringRuleService, "search");
      
      var testParams = { "label": "scoring-rule-label" };
      scope.searchScoringRules(testParams);
      expect(scoringRuleService.search).toHaveBeenCalledWith(testParams);
  });
  
  it('post processes searched scoringRules by calling service', function(){
      scope.postProcessScoringRules(savedScoringRule);
      scope.$root.$digest();
  });
  
  it('transitions to create view with searchParams copied when createNewScoringRule() called', function(){
      spyOn(state, "transitionTo");
      
      scope.searchParams = { "assessmentId":"assessment_id", "scoringRuleId":"idA", "label":"scoring-rule-label" };
      scope.createNewScoringRule();
      expect(state.transitionTo).toHaveBeenCalledWith( "assessmenthome.scoringruleedit", { "assessmentId":"assessment_id", "scoringRuleId":"", "label":"scoring-rule-label" });
  });
  
  it('transitions to edit view with scoringRuleId populated when edit() called', function(){
      spyOn(state, "transitionTo");
      
      scope.view(savedScoringRule);
      expect(state.transitionTo).toHaveBeenCalledWith( "assessmenthome.scoringruleedit", { "assessmentId":"assessment_id", "scoringRuleId":savedScoringRule.id });
  });
  
});

