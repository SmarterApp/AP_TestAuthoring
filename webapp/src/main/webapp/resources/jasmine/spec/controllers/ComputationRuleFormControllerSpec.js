describe('ComputationRuleFormController ', function() {
  var scope = null;
  var state = null;
  var computationRuleService = null;
  var windowMock = null;
  var q = null;
  
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
  
  var savedComputationRule = {
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
  
  var existingComputationRule = {
          "id" : "id_12345",
          "name" : "comp-rule-name2",
          "uniqueId" : "uniqueId2",
          "version" : "v1",
          "conversionTableType" : "BOTH",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName2",
          "computationRuleType" : "INTEGER",
          "defaultValue" : "2",
          "minimumValue" : "1",
          "maximumValue" : "99",
          "computationRuleMultiplicityType" : "SCALAR" }
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
              },
          };
      });
  }));
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ComputationRuleService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");

        // initiate required variables
        state = $state;
        state.current = {};

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
        
        computationRuleService = ComputationRuleService;
        
        // create controller
        $controller('ComputationRuleFormController', {
            $scope : scope,
            $window : windowMock,
            computationRuleService: ComputationRuleService,
            loadedData: {data:{}, errors:[]},
            formAction: "Add"
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(computationRuleService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      
      httpMock.expectGET(/computationRule\/computationRuleTypes/).respond(expectedComputationRuleTypes);
      httpMock.expectGET(/computationRule\/conversionTableTypes/).respond(expectedConversionTableTypes);
      httpMock.expectGET(/computationRule\/computationRuleMultiplicityTypes/).respond(expectedComputationRuleMultiplicityTypes);
      httpMock.expectGET(/computationRule\/dictionaryIndexTypes/).respond(expectedDictionaryIndexTypes);
      httpMock.expectPOST(/computationRule/).respond(savedComputationRule);
      scope.save(unsavedComputationRule);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(computationRuleService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.computationRule = unsavedComputationRule;
      
      httpMock.expectGET(/computationRule\/computationRuleTypes/).respond(expectedComputationRuleTypes);
      httpMock.expectGET(/computationRule\/conversionTableTypes/).respond(expectedConversionTableTypes);
      httpMock.expectGET(/computationRule\/computationRuleMultiplicityTypes/).respond(expectedComputationRuleMultiplicityTypes);
      httpMock.expectGET(/computationRule\/dictionaryIndexTypes/).respond(expectedDictionaryIndexTypes);
      httpMock.expectPOST(/computationRule/).respond(savedComputationRule);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.computationRule).toBe(savedComputationRule);
  });
  
  it('handles errors correctly when computationRuleService.save() fails', function() {
      spyOn(computationRuleService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.computationRule = existingComputationRule;
      
      httpMock.expectGET(/computationRule\/computationRuleTypes/).respond(expectedComputationRuleTypes);
      httpMock.expectGET(/computationRule\/conversionTableTypes/).respond(expectedConversionTableTypes);
      httpMock.expectGET(/computationRule\/computationRuleMultiplicityTypes/).respond(expectedComputationRuleMultiplicityTypes);
      httpMock.expectGET(/computationRule\/dictionaryIndexTypes/).respond(expectedDictionaryIndexTypes);
      httpMock.expectPUT(/computationRule/).respond(400, {"messages" : {"duplicateKey" : [ "Scoring Function already exists for identifier: " + existingComputationRule.id + ", version: " + existingComputationRule.version + "." ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.computationRule).toBe(existingComputationRule);
  });
  
});
