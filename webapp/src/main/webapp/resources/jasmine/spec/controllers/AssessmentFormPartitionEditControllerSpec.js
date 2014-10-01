describe('AssessmentFormPartitionEditController ', function() {
  var scope = null;
  var state = null;
  var formPartitionService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedFormPartition = {
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
  };
  
  var savedFormPartition = {
          "id" : "newId",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
  };
  
  var existingFormPartition = {
          "id" : "id_12345",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, FormPartitionService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");

        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"FormPartition List", select:"assessmenthome.formpartition", active:false }];
        scope.tabIndexes = {FORM:0};

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
        
        formPartitionService = FormPartitionService;
        
        // create controller
        $controller('AssessmentFormPartitionEditController', {
            $scope : scope,
            $window : windowMock,
            formPartitionService: FormPartitionService,
            loadedData: {data:{}, errors:[]},
            loadedFormList: {data:[], errors:[]},
            loadedFormPartition: {data:{}, errors:[]},
            segmentList: {data:{"searchResults" : []}, errors:[]}
      });
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(formPartitionService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/formPartition/).respond(unsavedFormPartition);
      scope.save(unsavedFormPartition);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates formPartition correctly when save() called', function() {
      spyOn(formPartitionService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.formPartition = unsavedFormPartition;
      httpMock.expectPOST(/formPartition/).respond(savedFormPartition);
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.formPartition).toBe(savedFormPartition);
  });
  
  it('handles errors correctly when formPartitionService.save() fails', function() {
      spyOn(formPartitionService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.formPartition = angular.copy(existingFormPartition);
      httpMock.expectPUT(/formPartition/).respond(400, {"messages" : {"duplicateKey" : [ "Form Partition already exists in this form for name: " + existingFormPartition.name ]} });
      
      scope.save();
      httpMock.flush();

      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.formPartition).toEqual(existingFormPartition);
  });
});
