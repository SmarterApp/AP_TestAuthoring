describe('AssessmentSimulationRecordEditController ', function() {
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
        state.current = {"docType": "simulation"};

        var mockForm = {};
        mockForm.$setPristine = function(){};
        scope.editableForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        fileGroupService = FileGroupService;
        
        // create controller
        $controller('AssessmentSimulationRecordEditController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: {id : "assessment_id"} },
            loadedRecord : { errors: [], data: savedSimulationRecord },
            loadedFileGroup : { errors: [], data: savedSimulationFileGroup },
            formAction:{ errors: [], data: "Edit" },
            fileGroupService: FileGroupService
      });
        
  }));
  
  it('saves a new simulation file group and updates record', function() {
	  spyOn(fileGroupService, "saveSimulationRecord").andCallThrough();
      spyOn(fileGroupService, "save").andCallThrough();
      
      scope.fileGroup = unsavedSimulationFileGroup;
      scope.assessment = {"id": "assessmentId"};
      
      httpMock.expectPUT(/^fileGroup/).respond(savedSimulationFileGroup);
      httpMock.expectPOST(/^fileGroup/).respond(savedSimulationFileGroup);
      scope.save();
      httpMock.flush();

      expect(fileGroupService.saveSimulationRecord).toHaveBeenCalledWith(savedSimulationRecord);
      expect(fileGroupService.save).toHaveBeenCalledWith(unsavedSimulationFileGroup);
      expect(scope.errors.length).toBe(0);
  });
  
});
