describe('AssessmentPerformanceLevelEditController ', function() {
  var scope = null;
  var state = null;
  var performanceLevelService = null;
  var windowMock = null;
  var q = null;

  var unsavedPerformanceLevel = {
          "assessmentId" : "assessment-1",
          "level" : 1,
          "blueprintReferenceType": "SEGMENT",
          "blueprintReferenceId": "segment-1",
          "scaledLo": 1.0,
          "scaledHi": 5.0
  };
  
  var savedPerformanceLevel = {
          "id" : "newId",
          "assessmentId" : "assessment-1",
          "level" : 1,
          "blueprintReferenceType": "SEGMENT",
          "blueprintReferenceId": "segment-1",
          "scaledLo": 1.0,
          "scaledHi": 5.0
  };
  
  var existingPerformanceLevel = {
          "id" : "id_12345",
          "assessmentId" : "assessment-1",
          "level" : 1,
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
       
        var mockForm = { isPristine: true };
        mockForm.$setPristine = function(){ this.isPristine = true; };
        mockForm.$setError = function(fieldname, msg){
            angular.forEach(this.$editables, function(editable) {
                if(!name || editable.name === name) {
                  editable.setError(msg);
                }
            });
        };
       
        scope.editableForm = mockForm;
        scope.editableForm.blueprintReferenceId ="segment-1";
        scope.editableForm .blueprintReferenceId.$dirty = false;
        windowMock = $window;
        q = $q;
        
        performanceLevelService = PerformanceLevelService;
        
        // create controller
        $controller('AssessmentPerformanceLevelEditController', {
            $scope : scope,
            $window : windowMock,
            performanceLevelService: PerformanceLevelService,
            loadedData: {data:{}, errors:[]},
            loadedPerformanceLevel: {data:{}, errors:[]},
            loadedBlueprintReferenceTypes: {data:{"searchResults" : []}, errors:[]}
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(performanceLevelService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);

      httpMock.expectPOST(/^performanceLevel/).respond(savedPerformanceLevel);
      scope.save(unsavedPerformanceLevel);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(performanceLevelService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.performanceLevel = unsavedPerformanceLevel;
      
      httpMock.expectPOST(/^performanceLevel/).respond(savedPerformanceLevel);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.performanceLevel).toBe(savedPerformanceLevel);
  });
  
  it('handles errors correctly when performanceLevelService.save() fails', function() {
      spyOn(performanceLevelService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.performanceLevel = angular.copy(existingPerformanceLevel);
      
      httpMock.expectPUT(/^performanceLevel/).respond(400, {"messages" : {"duplicateKey" : [ "Performance Level already exists for for BP Reference: " + existingPerformanceLevel.blueprintReferenceId ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
  });
  
});
