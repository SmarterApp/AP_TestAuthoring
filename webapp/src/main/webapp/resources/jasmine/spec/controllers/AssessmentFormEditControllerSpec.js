describe('AssessmentFormEditController ', function() {
  var scope = null;
  var state = null;
  var formService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedForm = {
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
  };
  
  var savedForm = {
          "id" : "newId",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
  };
  
  var existingForm = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, FormService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");

        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Form List", select:"assessmenthome.form", active:false }];
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
        
        formService = FormService;
        
        // create controller
        $controller('AssessmentFormEditController', {
            $scope : scope,
            $window : windowMock,
            formService: FormService,
            loadedData: {data:{}, errors:[]},
            loadedForm: {data:{}, errors:[]},
            loadedLanguages: {data:{"searchResults" : []}, errors:[]},
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(formService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/^form/).respond(savedForm);
      scope.save(unsavedForm);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(formService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.form = unsavedForm;
      
      httpMock.expectPOST(/^form/).respond(savedForm);
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.form).toBe(savedForm);
  });
  
  it('handles errors correctly when formService.save() fails', function() {
      spyOn(formService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.form = angular.copy(existingForm);
      
      httpMock.expectPUT(/^form/).respond(400, {"messages" : {"duplicateKey" : [ "Form already exists for assessment ID: " + existingForm.id + ", name: " + existingForm.name + "." ] } });
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.form).toEqual(existingForm);
  });
});
