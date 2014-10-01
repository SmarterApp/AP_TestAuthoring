describe('AssessmentSearchController ', function() {
  var scope = null;
  var state = null;
  var assessmentService = null;
  var windowMock = null;
  var q = null;
  
  var savedAssessment = {
          "id" : "id_12345",
          "name" : "Mathematics Test",
        };
  
  var savedAssessment2 = {
          "id" : "id_67890",
          "name" : "Chemistry Test",
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, AssessmentService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        // initiate required variables
        state = $state;
        state.current = {};
        assessmentService = AssessmentService;
        windowMock = $window;
        q = $q;
        
        assessmentService = AssessmentService;
        
        // create controller
        $controller('AssessmentSearchController', {
            $scope : scope,
            $window : windowMock,
            loadedGrades: { data: { payload: [] } },
            loadedAssessmentTypes: {},
            loadedAssessmentStatuses: {},
            assessmentService: AssessmentService
      });
        
  }));

  it('calls correct service when search() called', function(){
      spyOn(assessmentService, "search");
      var searchParams = { "name": "searchName" };
      scope.searchTests(searchParams);
      expect(assessmentService.search).toHaveBeenCalledWith(searchParams);
  });
  
  it('transitions to new assessment page when createNewItem() called', function(){
      spyOn(state, "transitionTo");
      scope.searchParams = { "searchDirection": "asc" };
      scope.createNewItem();
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.detailhome.edit', {"assessmentId":"", "searchDirection":"asc"});
  });
  
  it('transitions to assessment details page when view() called', function(){
      spyOn(state, "transitionTo");
      var assessment = { "id": "testId" };
      scope.edit(assessment);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.detailhome.edit', {"assessmentId":"testId"});
  });
  
  it('deletes assessment by calling service and removing from search results', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(assessmentService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      httpMock.expectGET(/subject/).respond(existingSubject);
      httpMock.expectDELETE(/assessment/).respond("");
      
      scope.remove(savedAssessment);
      httpMock.flush();
      
      expect(assessmentService.remove).toHaveBeenCalledWith(savedAssessment);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-assessment-search');
  });
  
  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(assessmentService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedAssessment, savedAssessment2 ];
      httpMock.expectGET(/subject/).respond(existingSubject);
      httpMock.expectDELETE(/assessment/).respond(400, {"messages" : {"assessmentId" : [ "Invalid Assessment ID." ] } });
      
      scope.remove(savedAssessment2);
      httpMock.flush();
      
      expect(assessmentService.remove).toHaveBeenCalledWith(savedAssessment2);
      expect(scope.errors).toEqual( [ "Invalid Assessment ID." ] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-assessment-search');
      expect(scope.searchResponse.searchResults.length).toBe(2);
      expect(scope.searchResponse.searchResults).toContain( savedAssessment );
  });
});

