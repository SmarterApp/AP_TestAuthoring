describe('AssessmentScoringRuleEditController ', function() {
  var scope = null;
  var state = null;
  var scoringRuleService = null;
  var segmentService = null;
  var affinityGroupService = null;
  var blueprintElementService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedScoringRule = {
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
		  "blueprintReferenceType" : "TEST",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "valueConversionTable" : "YTdvAmk=",
		  "standardErrorConversionTable" : "TU8EbzE=",
		  "parameterDataMap" : {
				"parameter1" : {
				  "parameterValueKey1" : "1",
				  "parameterValueKey2" : "2",
				  "parameterValueKey3" : "3",
				  "parameterValueKey4" : "4",
				  "parameterValueKey5" : "5"
				},
				"parameter2" : {
					  "parameterValueKey2" : "soleString"
					},
				"parameter3" : {
				  "3" : "74.99",
				  "2" : "49.99",
				  "1" : "24.99",
				  "4" : "99.99"
				}
		  }
        };
  
  var savedScoringRule = {
          "id" : "newId",
		  "assessmentId" : "assessmentId",
		  "order" : 1,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
		  "blueprintReferenceType" : "TEST",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "valueConversionTable" : "YTdvAmk=",
		  "standardErrorConversionTable" : "TU8EbzE=",
		  "parameterDataMap" : {
				"parameter1" : {
				  "parameterValueKey1" : "1",
				  "parameterValueKey2" : "2",
				  "parameterValueKey3" : "3",
				  "parameterValueKey4" : "4",
				  "parameterValueKey5" : "5"
				},
				"parameter2" : {
					  "parameterValueKey2" : "soleString"
					},
				"parameter3" : {
				  "3" : "74.99",
				  "2" : "49.99",
				  "1" : "24.99",
				  "4" : "99.99"
				}
		  }
        };
  
  var existingScoringRule = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
		  "order" : 2,
		  "computationRuleId" : "computationRuleId",
		  "label" : "scoring-rule-label",
		  "blueprintReferenceType" : "TEST",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "valueConversionTable" : "YTdvAmk=",
		  "standardErrorConversionTable" : "TU8EbzE=",
		  "parameterDataMap" : {
				"parameter1" : {
				  "parameterValueKey1" : "1",
				  "parameterValueKey2" : "2",
				  "parameterValueKey3" : "3",
				  "parameterValueKey4" : "4",
				  "parameterValueKey5" : "5"
				},
				"parameter2" : {
					  "parameterValueKey2" : "soleString"
					},
				"parameter3" : {
				  "3" : "74.99",
				  "2" : "49.99",
				  "1" : "24.99",
				  "4" : "99.99"
				}
		  }
        };
  
  var existingComputationRule = {
          "id" : "newId",
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ScoringRuleService, ComputationRuleService, AffinityGroupService, BlueprintElementService) {
     
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

        var mockForm = { isPristine: true };
        mockForm.$setPristine = function(){ this.isPristine = true; };
        scope.editableForm = mockForm;
        mockForm.$setError = function(fieldname, msg){
            angular.forEach(this.$editables, function(editable) {
                if(!name || editable.name === name) {
                  editable.setError(msg);
                }
            });
        };
        
        windowMock = $window;
        q = $q;
        
        scoringRuleService = ScoringRuleService;
        computationRuleService = ComputationRuleService;
        affinityGroupService = AffinityGroupService;
        blueprintElementService = BlueprintElementService;
        
        // create controller
        $controller('AssessmentScoringRuleEditController', {
            $scope : scope,
            $window : windowMock,
            scoringRuleService: ScoringRuleService,
            computationRuleService: ComputationRuleService,
            loadedData: {data:{}, errors:[]},
    		loadedBlueprintReferenceTypes: {data:{}, errors:[]},
    		loadedBlueprintDenotationTypes: {data:{}, errors:[]},
            loadedScoringRule: {data:{}, errors:[]},
            scoringRuleList: {data:{"searchResults" : []}, errors:[]},
            SegmentService: segmentService,
            affinityGroupService: AffinityGroupService,
            blueprintElementService: BlueprintElementService
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(scoringRuleService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectGET(/computationRule/).respond(existingComputationRule);
      httpMock.expectPOST(/scoringRule/).respond(savedScoringRule);
      scope.save(unsavedScoringRule);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(scoringRuleService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.scoringRule = unsavedScoringRule;
      
      httpMock.expectGET(/computationRule/).respond(existingComputationRule);
      httpMock.expectPOST(/scoringRule/).respond(savedScoringRule);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.scoringRule).toBe(savedScoringRule);
  });
  
  it('handles errors correctly when scoringRuleService.save() fails', function() {
      spyOn(scoringRuleService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.scoringRule = existingScoringRule;
      
      httpMock.expectGET(/computationRule/).respond(existingComputationRule);
      httpMock.expectPUT(/scoringRule/).respond(400, {"messages" : {"duplicateKey" : [ "Scoring Rule already exists in this assessment for label: " + existingScoringRule.label ] } });
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.scoringRule).toBe(existingScoringRule);
  });
  
});
