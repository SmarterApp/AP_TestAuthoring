describe('AssessmentReportingMeasureEditController ', function() {
  var scope = null;
  var state = null;
  var reportingMeasureService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedReportingMeasure = {
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "SEGMENT",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
  };
  
  var savedReportingMeasure = {
          "id" : "newId",
		  "assessmentId" : "assessmentId",
		  "blueprintReferenceType" : "SEGMENT",
		  "blueprintReferenceId" : "blueprintReferenceId",
		  "scoringRuleIdList" : [ "scoringRuleId1", "scoringRuleId2"]
  };
  
  var existingReportingMeasure = {
          "id" : "id_12345",
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
        scope.tabs = [{ label:"ReportingMeasure List", select:"assessmenthome.reportingmeasures", active:false }];
        scope.tabIndexes = {REPORTING:0};

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
        
        reportingMeasureService = ReportingMeasureService;
        
        // create controller
        $controller('AssessmentReportingMeasureEditController', {
            $scope : scope,
            $window : windowMock,
            reportingMeasureService: ReportingMeasureService,
            loadedData: {data:{}, errors:[]},
            loadedReportingMeasure: {data:{}, errors:[]},
            loadedReportingMeasureScoringRule: {data:{"searchResults" : []}, errors:[]},
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(reportingMeasureService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/^reportingMeasure/).respond(savedReportingMeasure);
      scope.save(unsavedReportingMeasure);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates reportingMeasure correctly when save() called', function() {
      spyOn(reportingMeasureService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.reportingMeasure = unsavedReportingMeasure;
      
      httpMock.expectPOST(/^reportingMeasure/).respond(savedReportingMeasure);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.reportingMeasure).toBe(savedReportingMeasure);
  });
  
  it('handles errors correctly when reportingMeasureService.save() fails', function() {
      spyOn(reportingMeasureService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.reportingMeasure = angular.copy(existingReportingMeasure);
      
      httpMock.expectPUT(/^reportingMeasure/).respond(400, {"messages" : {"duplicateKey" : [ "Reporting Measure already exists for assessment ID: " + existingReportingMeasure.assessmentId + ", blueprintReference ID: " + existingReportingMeasure.blueprintReferenceId + "." ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
  });
});
