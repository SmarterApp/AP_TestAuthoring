describe('AssessmentItemMetadataConfigController ', function() {
  var scope = null;
  var state = null;
  var itemMetadataConfigService = null;
  var windowMock = null;
  var q = null;	
  
  var unsavedItemMetadataConfig = {
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
  };
  
  var savedItemMetadataConfig = {
          "id" : "newId",
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
  };
  
  var existingItemMetadataConfig = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
          "itemMetadataReckonSet" : ["itemMetadataField1", "itemMetadataField2"]
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ItemMetadataConfigService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");

        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Publishing", select:"assessmenthome.publishing.itemmetadataconfig", active:false }];
        scope.tabIndexes = {PUBLISHING:0};

        var mockForm = { isPristine: true, isDirty: true };
        mockForm.$setPristine = function(){ this.isPristine = true; };
        mockForm.$dirty = function(){ this.isDirty = true; };
        scope.editableForm = mockForm;
        mockForm.$setError = function(fieldname, msg){
            angular.forEach(this.$editables, function(editable) {
                if(!name || editable.name === name) {
                  editable.setError(msg);
                }
            });
        };
        
        scope.editableForm = mockForm;
        windowMock = $window;
        q = $q;
        
        itemMetadataConfigService = ItemMetadataConfigService;
        
        // create controller
        $controller('AssessmentItemMetadataConfigController', {
            $scope : scope,
            $window : windowMock,
            itemMetadataConfigService: ItemMetadataConfigService,
            loadedData: {data:{}, errors:[]},
            loadedItemMetadataConfig: {data:{}, errors:[]},
            itemMetadataKeys: {data:{}, errors:[]}
      });
  }));

  it('toggles saving indicator when save() is called', function() {
      spyOn(itemMetadataConfigService, "save").andCallThrough();
      scope.editableForm.isDirty = true;

      expect(scope.savingIndicator).toEqual(false);

      httpMock.expectPOST(/^itemMetadataConfig/).respond(savedItemMetadataConfig);
      scope.save(unsavedItemMetadataConfig);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(itemMetadataConfigService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      scope.editableForm.isDirty = true;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.itemMetadataConfig = unsavedItemMetadataConfig;
      
      httpMock.expectPOST(/^itemMetadataConfig/).respond(savedItemMetadataConfig);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.itemMetadataConfig).toBe(savedItemMetadataConfig);
  });
  
  it('handles errors correctly when itemMetadataConfigService.save() fails', function() {
      spyOn(itemMetadataConfigService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      scope.editableForm.isDirty = true;

      scope.itemMetadataConfig = angular.copy(existingItemMetadataConfig);
      
      httpMock.expectPUT(/^itemMetadataConfig/).respond(400, {"messages" : {"duplicateKey" : [ "Item Metadata Config already exists for assessment: " + existingItemMetadataConfig.assessmentId ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
  });
});
