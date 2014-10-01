describe('AssessmentSegmentController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var segmentService = null;

  var savedSegment = {
          "id" : "id_12345",
          "assessmentId" : "myAssessmentId",
          "position" : "1",
          "minItems" : "0",
          "maxItems" : "10"
        };
  
  var savedSegment2 = {
          "id" : "id_67890",
          "assessmentId" : "myAssessmentId",
          "position" : "2",
          "minItems" : "0",
          "maxItems" : "5"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, SegmentService) {
	  
        //create a scope object for us to use.
        scope = $rootScope.$new();
        rootScope = $rootScope;
        windowMock = $window;
        q = $q;
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Segments", select:"assessmenthome.segment", active:false }];
        scope.tabIndexes = {SEGMENT:0};
        
        segmentService = SegmentService;

        // create controller
        $controller('AssessmentSegmentController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            segmentList: {data:{"searchResults" : []}, errors:[]},
            segmentService: SegmentService
        });
        
  }));

  it('calls correct service when searchSegments() called', function() {
      spyOn(segmentService, "search");
      var searchParams = { "name": "searchName" };
      scope.searchSegments(searchParams);
      expect(segmentService.search).toHaveBeenCalledWith(searchParams);
  });
  

  
  it('transitions to segment details page when view() called', function() {
      spyOn(state, "transitionTo");
      scope.assessment = { id: "myAssessmentId" };
      var segment = { "id": "mySegmentId" };
      scope.view(segment);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.segmentedit', {"assessmentId":"myAssessmentId", "segmentId":"mySegmentId"});
  });

  it('deletes segment by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(segmentService, "remove").andCallThrough();
      spyOn(segmentService, "search").andCallThrough();
      scope.assessment = { id: "myAssessmentId" };

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedSegment, savedSegment2 ];
      
      httpMock.expectDELETE(/^segment/).respond("");
      httpMock.expectGET(/^segment/).respond( { "data": {"searchResults": [savedSegment, savedSegment2]}, "errors": [] } );
      
      scope.remove(savedSegment);
      httpMock.flush();
      
      var expectedSearchParams = { "assessmentId": "myAssessmentId", "pageSize": 10 };
      expect(segmentService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(segmentService.remove).toHaveBeenCalledWith(savedSegment);
      expect(scope.errors).toEqual([]);
      expect(scope.searchResponse.searchResults.length).toBe(1);
      expect(scope.searchResponse.searchResults).toContain( savedSegment2 );
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);
      spyOn(segmentService, "remove").andCallThrough();

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedSegment, savedSegment2 ];
      
      httpMock.expectDELETE(/^segment/).respond("");
      httpMock.expectGET(/^segment/).respond( { "data": {"searchResults": [savedSegment, savedSegment2]}, "errors": [] } );

      scope.remove(savedSegment2);
      httpMock.flush();
      
      expect(segmentService.remove).toHaveBeenCalledWith(savedSegment2);
      expect(scope.errors).toEqual([]);
      expect(scope.searchResponse.searchResults.length).toBe(1);
      expect(scope.searchResponse.searchResults).toContain( savedSegment );
  });
});
