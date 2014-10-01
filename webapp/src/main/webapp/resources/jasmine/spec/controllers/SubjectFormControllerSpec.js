describe('SubjectFormController ', function() {
  var scope = null;
  var state = null;
  var subjectService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedSubject = {
          "name" : "Mathematics",
          "abbreviation" : "MATH",
          "description" : "This is a course about numbers."
        };
  
  var savedSubject = {
          "id" : "newId",
          "name" : "Mathematics",
          "abbreviation" : "MATH",
          "description" : "This is a course about numbers."
        };
  
  var existingSubject = {
          "id" : "id_12345",
          "name" : "Chemistry",
          "abbreviation" : "CHEM",
          "description" : "This is a course about mixing stuff."
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, SubjectService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.selectedTenantName={"name":"WI"};

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
        
        subjectService = SubjectService;
        
        // create controller
        $controller('SubjectFormController', {
            $scope : scope,
            $window : windowMock,
            subjectService: SubjectService,
            loadedData: {data:{}, errors:[]},
        	formAction: {formAction:"Edit"}
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(subjectService, "save").andCallThrough();
      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/^subject/).respond(savedSubject);
      scope.save(unsavedSubject);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(subjectService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.subject = unsavedSubject;
      
      httpMock.expectPOST(/^subject/).respond(savedSubject);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.subject).toBe(savedSubject);
  });
  
  it('handles errors correctly when subjectService.save() fails', function() {
      spyOn(subjectService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      scope.subject = existingSubject;
      
      httpMock.expectPUT(/^subject/).respond(400, {"messages" : {"duplicateKey" : [ "Subject already exists for name: " + existingSubject.name + " or abbreviation: " + existingSubject.abbreviation + "." ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.subject).toBe(existingSubject);
  });

  
});

