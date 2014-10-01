describe('SubjectSearchController ', function() {
  var scope = null;
  var state = null;
  var subjectService = null;
  var progmanService = null;
  var assessmentService = null;
  var windowMock = null;
  var q = null;
  
  var savedSubject = {
          "id" : "id_12345",
          "name" : "Mathematics",
          "abbreviation" : "MATH",
          "description" : "This is a course about numbers.",
          "tenantId" : "tenant1"
        };
  
  var savedSubject2 = {
          "id" : "id_67890",
          "name" : "Chemistry",
          "abbreviation" : "CHEM",
          "description" : "This is a course about mixtures.",
          "tenantId": "tenant2"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, SubjectService, ProgmanService) {
     
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
        scope.subjectForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        subjectService = SubjectService;
        progmanService = ProgmanService;
        
        // create controller
        $controller('SubjectSearchController', {
            $scope : scope,
            $window : windowMock,
            subjectService: SubjectService,
            progmanService: ProgmanService,
      });
        
  }));
  
  it('searches subjects by calling service', function(){
      spyOn(subjectService, "search");
      
      var testParams = { "name": "Mathematics" };
      scope.searchSubjects(testParams);
      expect(subjectService.search).toHaveBeenCalledWith(testParams);
  });
  
  it('transitions to create view with searchParams copied when createNewSubject() called', function(){
      spyOn(state, "transitionTo");
      
      scope.searchParams = { "subjectId":"idA", "name":"History" };
      scope.createNewSubject();
      expect(state.transitionTo).toHaveBeenCalledWith( "subjectForm", { "subjectId":"", "name":"History" });
  });
  
  it('transitions to edit view with subjectId populated when edit() called', function(){
      spyOn(state, "transitionTo");
      
      scope.edit(savedSubject);
      expect(state.transitionTo).toHaveBeenCalledWith( "subjectForm", { "subjectId":savedSubject.id, "formAction": "Edit"});
  });
  
  it('retires subject by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(subjectService, "retireSubject").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedSubject, savedSubject2 ];

      httpMock.expectPUT(/^subject/).respond(savedSubject);
      scope.retireSubject(savedSubject, false);
      httpMock.flush();
      
      expect(subjectService.retireSubject).toHaveBeenCalledWith(savedSubject.id, false);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-subject-search');
  });
});

