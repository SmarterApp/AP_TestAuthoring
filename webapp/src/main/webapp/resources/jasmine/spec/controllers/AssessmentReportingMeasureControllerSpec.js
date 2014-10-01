describe('AssessmentReportingMeasureController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var q;
  var reportingMeasureService = null;

  var savedReportingMeasure = {
          "id" : "id_12345",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "SEGMENT",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
  };
  
  var savedReportingMeasure2 = {
          "id" : "id_67890",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "SEGMENT",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ReportingMeasureService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"ReportingMeasure List", select:"assessmenthome.reportingMeasures", active:false }];
        scope.tabIndexes = {REPORTING:0};

        windowMock = $window;
        q = $q;
        
        reportingMeasureService = ReportingMeasureService;
        
        // create controller
        $controller('AssessmentReportingMeasureController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            scoringRuleList: [],
    		loadedBlueprintReferenceTypes: {data:{}, errors:[]},
            reportingMeasureService: ReportingMeasureService
      });
        
  }));

  it('calls correct service when searchReportingMeasures() called', function(){
      spyOn(reportingMeasureService, "search");
      var searchParams = { "blueprintReferenceType": "SEGMENT" };
      scope.searchReportingMeasures(searchParams);
      expect(reportingMeasureService.search).toHaveBeenCalledWith(searchParams);
  });
  
  it('transitions to reportingMeasure details page when view() called', function(){
      spyOn(state, "transitionTo");
      scope.assessment = { id: "assessmentId" };
      var reportingMeasure = { "id": "myReportingMeasureId" };
      scope.view(reportingMeasure);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.reportingmeasureedit', {"assessmentId":"assessmentId", "reportingMeasureId":"myReportingMeasureId"});
  });

  it('deletes reportingMeasure by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(reportingMeasureService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      scope.assessment = { id: "assessmentId" };

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedReportingMeasure, savedReportingMeasure2 ];
      
      httpMock.expectDELETE(/^reportingMeasure/).respond("");
      scope.remove(savedReportingMeasure);
      httpMock.flush();
      
      expect(reportingMeasureService.remove).toHaveBeenCalledWith(savedReportingMeasure);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-reportingmeasure-search');
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(reportingMeasureService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      httpMock.expectDELETE(/^reportingMeasure/).respond(400, {"messages" : {"reportingMeasureId" : [ "Invalid Reporting Measure ID." ] } });
      
      scope.remove(savedReportingMeasure2);
      httpMock.flush();
      
      expect(reportingMeasureService.remove).toHaveBeenCalledWith(savedReportingMeasure2);
      expect(scope.errors).toEqual( [ "Invalid Reporting Measure ID." ] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-reportingmeasure-search');

  });
});
