describe('PublicationSearchController ', function() {
  var scope = null;
  var state = null;
  var publicationService = null;
  var progmanService = null;
  var assessmentService = null;
  var windowMock = null;
  var q = null;
  
  var subject = {
		  "name": "Mathematics", 
		  "abbreviation": "MATH",
		  "description": "This is a course about numbers."
  };
  
  var scienceSubject = {
		  "id": "id_12345",
		  "name": "Chemistry", 
		  "abbreviation": "CHEM",
		  "description": "This is a course about mixing stuff."
  };
  
  var subjectList = [ subject, scienceSubject ];
  
  var savedPublication = {
          "id" : "id_12345",
          "name" : "Math Publication",
          "subject" : subject,
          "description" : "Publication of Mathematics.",
          "tenantId" : "tenant1"
       };
  
  var savedPublication2 = {
          "id" : "id_67890",
          "name" : "Chemistry Publication",
          "subject" : scienceSubject,
          "description" : "This is a Chemistry Publication.",
          "tenantId" : "tenant2"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, PublicationService) {
     
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
        scope.publicationform = mockForm;
        
        windowMock = $window;
        q = $q;
        
        publicationService = PublicationService;
        
        progmanService = {
            findTenant: function(tenantId) { 
                deferred = q.defer();
                deferred.resolve( { "data" : { "name":"tenant_name", "description":"tenant_description" } } );
                return deferred.promise;
            }
        };

        assessmentService = {
                search: function(publicationId) { 
                    deferred = q.defer();
                    deferred.resolve( { "data" : { "searchResults": [] } } );
                    return deferred.promise;
                }
            };
        // create controller
        $controller('PublicationSearchController', {
            $scope : scope,
            $window : windowMock,
            PublicationService: publicationService,
            ProgmanService: progmanService,
            AssessmentService: assessmentService
      });
        
  }));

  
  it('deletes publication by calling service and removing from search results', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(publicationService, "remove").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedPublication, savedPublication2 ];
      
      httpMock.expectGET(/^subject/).respond(subjectList);
      httpMock.expectDELETE(/^publication/).respond("");
      scope.remove(savedPublication);
      httpMock.flush();
      
      expect(publicationService.remove).toHaveBeenCalledWith(savedPublication);
      expect(scope.errors).toEqual([]);
      expect(scope.searchResponse.searchResults).toContain( savedPublication2 );
  });
  
  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(publicationService, "remove").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedPublication, savedPublication2 ];
      
      httpMock.expectGET(/^subject/).respond(subjectList);
      httpMock.expectDELETE(/^publication/).respond(400, {"messages" : {"publicationId" : [ "Invalid Publication ID." ] } });
      scope.remove(savedPublication2);
      httpMock.flush();
      
      expect(publicationService.remove).toHaveBeenCalledWith(savedPublication2);
      expect(scope.errors).toEqual( [ "Invalid Publication ID." ] );
      expect(scope.searchResponse.searchResults.length).toBe(2);
      expect(scope.searchResponse.searchResults).toContain( savedPublication );
  });
  
  it('searches publications by calling service', function(){
      spyOn(publicationService, "search");
      
      var testParams = { "name": "Math Publication" };
      scope.searchPublications(testParams);
      expect(publicationService.search).toHaveBeenCalledWith(testParams);
  });
  
  it('transitions to create view with searchParams copied when createNewPublication() called', function(){
      spyOn(state, "transitionTo");
      
      scope.searchParams = { "publicationId":"idA", "name":"History" };
      scope.createNewPublication();
      expect(state.transitionTo).toHaveBeenCalledWith( "publicationform", { "publicationId":"", "name":"History" });
  });
  
  it('transitions to edit view with publicationId populated when view() called', function(){
      spyOn(state, "transitionTo");
      
      scope.view(savedPublication);
      expect(state.transitionTo).toHaveBeenCalledWith( "publicationform", { "publicationId":savedPublication.id });
  });
  
  it('genererates a viewer-friendly string from when subjectDisplay() is called', function(){
      var subjectList = [subject,scienceSubject];
      var subjectString = scope.subjectDisplay(subjectList);
      expect(subjectString).toBe("Chemistry, Mathematics");
  });
  
});

