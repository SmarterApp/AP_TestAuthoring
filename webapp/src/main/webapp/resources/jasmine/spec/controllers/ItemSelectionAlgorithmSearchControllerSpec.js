
describe('ItemSelectionAlgorithmSearchController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  
  var savedItemSelectionAlgorithm = {
          "id" : "id_12345",
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
        };
  
  var savedItemSelectionAlgorithm2 = {
          "id" : "id_67890",
          "name" : "item-sel-algo-name2",
          "version" : "v1",
          "description" : "description",
          "parameters" : {
          "parameterName" : "parameterName",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "defaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
        }; 
  
  var expectedItemSelectionAlgorithmTypes = [ "FIXEDFORM", "ADAPTIVE" ];
    
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ItemSelectionAlgorithmService) {
     
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
        scope.itemSelectionAlgorithmForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        
        // create controller
        $controller('ItemSelectionAlgorithmSearchController', {
            $scope : scope,
            $window : windowMock
      });
        
  }));

  
  it('deletes itemSelectionAlgorithm by calling service and removing from search results', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
     
      httpMock.whenDELETE(/itemSelectionAlgorithm/).respond("");   
      
      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedItemSelectionAlgorithm, savedItemSelectionAlgorithm2 ];
      
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      scope.remove(savedItemSelectionAlgorithm);
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.searchResponse.searchResults.length).toBe(1);
      expect(scope.searchResponse.searchResults).toContain( savedItemSelectionAlgorithm2 );
  });
  
  
  it('searches itemSelectionAlgorithms by calling service', function(){
      var testParams = { "name": "item-sel-algo-name" };
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      httpMock.expectGET(/itemSelectionAlgorithm/).respond({"errors":[] , "searchResults" : [ savedItemSelectionAlgorithm, savedItemSelectionAlgorithm2 ] });
      scope.searchItemSelectionAlgorithms(testParams);
      httpMock.flush();
  });
  
  it('post processes searched itemSelectionAlgorithms by calling service', function(){
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      scope.postProcessItemSelectionAlgorithms(savedItemSelectionAlgorithm);
      httpMock.flush();
  });
  
  it('transitions to create view with searchParams copied when createNewItemSelectionAlgorithm() called', function(){
      spyOn(state, "transitionTo");
      
      scope.searchParams = { "itemSelectionAlgorithmId":"idA", "name":"item-sel-algo-name" };
      scope.createNewItemSelectionAlgorithm();
      expect(state.transitionTo).toHaveBeenCalledWith( "itemSelectionAlgorithmForm", { "itemSelectionAlgorithmId":"", "name":"item-sel-algo-name" });
  });

  it('transitions to view screen with itemSelectionAlgorithmId populated when view() called', function(){
      spyOn(state, "transitionTo");
      scope.view(savedItemSelectionAlgorithm);
      expect(state.transitionTo).toHaveBeenCalledWith( "itemSelectionAlgorithmForm", { "itemSelectionAlgorithmId":savedItemSelectionAlgorithm.id });
  });
  
});
