describe('ItemSelectionAlgorithmFormController ', function() {
  var scope = null;
  var state = null;
  var itemSelectionAlgorithmService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedItemSelectionAlgorithm = {
          "name" : "item-sel-algo-name",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "ADAPTIVE",
          "parameters" : {
          "parameterName" : "parameterName",
          "description" : "description",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "numberDefaultValue" : "2.00",
          "minimumValue" : "1.00",
          "maximumValue" : "99.00",
          "position" : 1 }
        };
  
  var savedItemSelectionAlgorithm = {
          "id" : "newId",
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
          "id" : "id_12345",
          "name" : "item-sel-algo-name2",
          "version" : "v1",
          "itemSelectionAlgorithmType" : "FIXEDFORM",
          "parameters" : {
          "parameterName" : "parameterName2",
          "description" : "description2",
          "itemSelectionPurpose" : "SCALAR",
          "itemSelectionType" : "FLOAT",
          "numberDefaultValue" : "2.00",
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
        
        itemSelectionAlgorithmService = ItemSelectionAlgorithmService;
        
        // create controller
        $controller('ItemSelectionAlgorithmFormController', {
            $scope : scope,
            $window : windowMock,
            itemSelectionAlgorithmService: ItemSelectionAlgorithmService,
            loadedData: {data:{}, errors:[]},
            formAction: "Add"
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(itemSelectionAlgorithmService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionPurposes/).respond(expectedItemSelectionPurposes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionTypes/).respond(expectedItemSelectionTypes);
      httpMock.expectPOST(/itemSelectionAlgorithm/).respond(savedItemSelectionAlgorithm);
      scope.save(unsavedItemSelectionAlgorithm);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(itemSelectionAlgorithmService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.itemSelectionAlgorithm = unsavedItemSelectionAlgorithm;
      
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionPurposes/).respond(expectedItemSelectionPurposes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionTypes/).respond(expectedItemSelectionTypes);
      httpMock.expectPOST(/itemSelectionAlgorithm/).respond(savedItemSelectionAlgorithm);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.itemSelectionAlgorithm).toBe(savedItemSelectionAlgorithm);
  });
  
  it('handles errors correctly when itemSelectionAlgorithmService.save() fails', function() {
      spyOn(itemSelectionAlgorithmService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.itemSelectionAlgorithm = existingItemSelectionAlgorithm;
      
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionAlgorithmTypes/).respond(expectedItemSelectionAlgorithmTypes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionPurposes/).respond(expectedItemSelectionPurposes);
      httpMock.expectGET(/itemSelectionAlgorithm\/itemSelectionTypes/).respond(expectedItemSelectionTypes);
      httpMock.expectPUT(/itemSelectionAlgorithm/).respond(400, {"messages" : {"duplicateKey" : [ "Item Selection Algorithm already exists for name: " + existingItemSelectionAlgorithm.name + ", version: " + existingItemSelectionAlgorithm.version + "." ] } });
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.itemSelectionAlgorithm).toBe(existingItemSelectionAlgorithm);
  });
  
});
