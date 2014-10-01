describe('AssessmentPerformanceLevelController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var q;
  var performanceLevelService = null;

  var savedPerformanceLevel = {
          "id" : "id_12345",
          "assessmentId" : "assessment-1",
          "level" : 1,
          "blueprintReferenceType": "SEGMENT",
          "blueprintReferenceId": "segment-1",
          "scaledLo": 1.0,
          "scaledHi": 5.0
  };
  
  var savedPerformanceLevel2 = {
          "id" : "id_67890",
          "assessmentId" : "assessment-1",
          "level" : 2,
          "blueprintReferenceType": "SEGMENT",
          "blueprintReferenceId": "segment-1",
          "scaledLo": 10.0,
          "scaledHi": 50.0
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, PerformanceLevelService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"PerformanceLevel List", select:"assessmenthome.performanceLevel", active:false }];
        scope.tabIndexes = {PERFORMANCE:0};

        windowMock = $window;
        q = $q;
        
        performanceLevelService = PerformanceLevelService;
        
        // create controller
        $controller('AssessmentPerformanceLevelController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            loadedBlueprintReferenceTypes: {data:{"searchResults" : []}, errors:[]},
            performanceLevelService: PerformanceLevelService
      });
        
  }));

  it('calls correct service when searchPerformanceLevels() called', function(){
      spyOn(performanceLevelService, "search");
      var searchParams = { "level": 1 };
      scope.searchPerformanceLevels(searchParams);
      expect(performanceLevelService.search).toHaveBeenCalledWith(searchParams);
  });
  

  
  it('transitions to performanceLevel details page when view() called', function(){
      spyOn(state, "transitionTo");
      scope.assessment = { id: "myAssessmentId" };
      var performanceLevel = { "id": "myPerformanceLevelId" };
      scope.view(performanceLevel);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.performanceleveledit', {"assessmentId":"myAssessmentId", "performanceLevelId":"myPerformanceLevelId"});
  });

  it('deletes performanceLevel by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(performanceLevelService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      scope.assessment = { id: "myAssessmentId" };

      httpMock.expectDELETE(/^performanceLevel/).respond("");
      
      scope.remove(savedPerformanceLevel);
      httpMock.flush();
      
      expect(performanceLevelService.remove).toHaveBeenCalledWith(savedPerformanceLevel);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-performancelevel-search');
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(performanceLevelService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      savedPerformanceLevel2.id = null;
      httpMock.expectDELETE(/^performanceLevel/).respond(400, {"messages" : {"performanceLevelId" : [ "Invalid Performance Level ID." ] } });
      
      scope.remove(savedPerformanceLevel2);
      httpMock.flush();
      
      expect(performanceLevelService.remove).toHaveBeenCalledWith(savedPerformanceLevel2);
      expect(scope.errors).toEqual( [ "Invalid Performance Level ID." ] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-performancelevel-search');

  });
});
