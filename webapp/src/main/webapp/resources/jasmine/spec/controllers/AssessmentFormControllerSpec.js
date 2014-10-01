describe('AssessmentFormController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var q;
  var formService = null;

  var savedForm = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
		  "name" : "form-name",
          "language" : "eng"
  };
  
  var savedForm2 = {
          "id" : "id_67890",
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

        windowMock = $window;
        q = $q;
        
        formService = FormService;
        
        // create controller
        $controller('AssessmentFormController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            loadedLanguages: {data:{"searchResults" : []}, errors:[]},
            formService: FormService
      });
        
  }));

  it('calls correct service when searchForms() called', function(){
      spyOn(formService, "search");
      var searchParams = { "name": "name-1" };
      scope.searchForms(searchParams);
      expect(formService.search).toHaveBeenCalledWith(searchParams);
  });
  
  it('transitions to form details page when view() called', function(){
      spyOn(state, "transitionTo");
      scope.assessment = { id: "assessmentId" };
      var form = { "id": "myFormId" };
      scope.view(form);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.formhome.formedit', {"assessmentId":"assessmentId", "formId":"myFormId"});
  });

  it('deletes form by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(formService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      scope.assessment = { id: "assessmentId" };

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedForm, savedForm2 ];
      
      httpMock.expectDELETE(/^form/).respond("");
      
      scope.remove(savedForm);
      httpMock.flush();
      
      expect(formService.remove).toHaveBeenCalledWith(savedForm);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-form-search');
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(formService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      savedForm2.id = null;
      httpMock.expectDELETE(/^form/).respond(400, {"messages" : {"formId" : [ "Invalid Form ID." ] } });
      
      scope.remove(savedForm2);
      httpMock.flush();
      
      expect(formService.remove).toHaveBeenCalledWith(savedForm2);
      expect(scope.errors).toEqual( [ "Invalid Form ID." ] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-form-search');

  });
});
