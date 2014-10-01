describe('ComputationRuleSearchController ', function() {
  var scope = null;
  var state = null;
  var computationRuleService = null;
  var windowMock = null;
  var q = null;
  
  var savedComputationRule = {
          "id" : "id_12345",
          "name" : "comp-rule-name",
          "uniqueId" : "uniqueId",
          "version" : "v1",
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
  
  var savedComputationRule2 = {
          "id" : "id_67890",
          "name" : "comp-rule-name2",
          "uniqueId" : "uniqueId2",
          "version" : "v1",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName2",
          "computationRuleType" : "INTEGER",
          "defaultValue" : "2",
          "minimumValue" : "1",
          "maximumValue" : "99",
          "computationRuleMultiplicityType" : "SCALAR" }
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ComputationRuleService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};

        var mockForm = {};
        mockForm.$setPristine = function(){};
        scope.computationRuleForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        computationRuleService = ComputationRuleService;
        
        // create controller
        $controller('ComputationRuleSearchController', {
            $scope : scope,
            $window : windowMock,
            computationRuleService: ComputationRuleService
      });
        
  }));

  
  it('deletes computationRule by calling service and removing from search results', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(computationRuleService, "remove").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedComputationRule, savedComputationRule2 ];
      
      httpMock.expectDELETE(/computationRule/).respond("");
      scope.remove(savedComputationRule);
      httpMock.flush();
      
      expect(computationRuleService.remove).toHaveBeenCalledWith(savedComputationRule);
      expect(scope.errors).toEqual([]);
      expect(scope.searchResponse.searchResults.length).toBe(1);
      expect(scope.searchResponse.searchResults).toContain( savedComputationRule2 );
  });
  
  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(computationRuleService, "remove").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedComputationRule, savedComputationRule2 ];
      
      httpMock.expectDELETE(/computationRule/).respond(400, {"messages" : {"computationRuleId" : [ "Invalid Scoring Function ID." ] } });
      scope.remove(savedComputationRule2);
      httpMock.flush();
      
      expect(computationRuleService.remove).toHaveBeenCalledWith(savedComputationRule2);
      expect(scope.errors).toEqual( [ "Invalid Scoring Function ID." ] );
      expect(scope.searchResponse.searchResults.length).toBe(1);
      expect(scope.searchResponse.searchResults).toContain( savedComputationRule );
  });
  
  it('searches computationRules by calling service', function(){
      spyOn(computationRuleService, "search");
      
      var testParams = { "name": "comp-rule-name" };
      scope.searchComputationRules(testParams);
      expect(computationRuleService.search).toHaveBeenCalledWith(testParams);
  });
  
  it('post processes searched computationRules by calling service', function(){
      scope.postProcessComputationRules(savedComputationRule);
      scope.$root.$digest();
  });
  
  it('transitions to create view with searchParams copied when createNewComputationRule() called', function(){
      spyOn(state, "transitionTo");
      
      scope.searchParams = { "computationRuleId":"idA", "name":"comp-rule-name" };
      scope.createNewComputationRule();
      expect(state.transitionTo).toHaveBeenCalledWith( "computationRuleForm", { "computationRuleId":"", "name":"comp-rule-name" });
  });

  it('transitions to view screen with computationRuleId populated when view() called', function(){
      spyOn(state, "transitionTo");
      
      scope.view(savedComputationRule);
      expect(state.transitionTo).toHaveBeenCalledWith( "computationRuleForm", { "computationRuleId":savedComputationRule.id });
  });
  
});

