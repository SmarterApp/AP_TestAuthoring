describe('AssessmentSimulationRecordController ', function() {
  var scope = null;
  var state = null;
  var fileGroupService = null;
  var windowMock = null;
  var q = null;
  
  var sampleGridFiles = [
         	{"gridFsId": "gridFsId1", "fileName": "Grid File 1"},
         	{"gridFsId": "gridFsId2", "fileName": "Grid File 2"},
         	{"gridFsId": "gridFsId3", "fileName": "Grid File 3"}
         ];
  
  
  var unsavedSimulationFileGroup = {
		  "simulationRecordId" : "simulationRecord_id",
		  "name" : "New Simulation Group",
          "gridFiles" : sampleGridFiles
        };
  
  var savedSimulationRecord = {
          "id" : "simrec_12345",
		  "assessmentId" : "assessment_id",
          "version" : "1.0",
          "lastUploadDate" : "1395181531128"
        };
  
  var savedSimulationFileGroup = {
          "id" : "simFileGroup_12345",
		  "simulationRecordId" : "simulationRecord_id",
		  "name" : "Saved Simulation Group",
          "gridFiles" : sampleGridFiles
        };
  
  var savedSimulationFileGroup2 = {
          "id" : "simFileGroup_67890",
		  "simulationRecordId" : "simulationRecord_id",
		  "name" : "Saved Simulation Group 2",
          "gridFiles" : sampleGridFiles
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, FileGroupService) {
     
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
        scope.editableForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        fileGroupService = FileGroupService;
        
        // create controller
        $controller('AssessmentSimulationRecordController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: {id : "assessment_id"} },
            loadedPublishingRecord : { errors: [], data: {id : "publishingRecord_id"} },
            loadedRecord : { errors: [], data: savedSimulationRecord },
            FileGroupService: fileGroupService
      });
        
  }));
  
  it('searches existing file groups and returns them in a list', function() {
      spyOn(fileGroupService, "search").andCallThrough();
      
	  scope.searchResponse = {};
	  scope.searchResponse.searchResults = [ savedSimulationFileGroup, savedSimulationFileGroup2 ];
      
      expect(scope.errors.length).toBe(0);
      expect(scope.searchResponse.searchResults.length).toBe(2);
  });
  
  it('removes a file group from the record', function() {
	  spyOn(windowMock,"confirm").andReturn(true);
      spyOn(fileGroupService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      
      scope.fileGroup = savedSimulationFileGroup;
      scope.assessment = {"id": "assessmentId"};
      
      httpMock.expectDELETE(/^fileGroup/).respond(savedSimulationFileGroup);
      scope.removeGroup(savedSimulationFileGroup);
      httpMock.flush();

      expect(fileGroupService.remove).toHaveBeenCalledWith(savedSimulationFileGroup);
      expect(scope.errors.length).toBe(0);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-docs-search');
  });
  
  it('removes a grid file from the selected file group', function() {
	  spyOn(windowMock,"confirm").andReturn(true);
      spyOn(fileGroupService, "removeGridFile").andCallThrough();
      
      scope.fileGroup = savedSimulationFileGroup;
      scope.assessment = {"id": "assessmentId"};
      var removedGridFile = sampleGridFiles[0];
      
      httpMock.expectDELETE(/^fileGroup\/gridFsFile/).respond(sampleGridFiles[0]);
      httpMock.expectPUT(/^fileGroup/).respond(savedSimulationFileGroup);
      scope.removeFile(savedSimulationFileGroup, sampleGridFiles[0], 0);
      httpMock.flush();

      expect(fileGroupService.removeGridFile).toHaveBeenCalledWith(removedGridFile);
      expect(scope.errors.length).toBe(0);
  });
  
});
