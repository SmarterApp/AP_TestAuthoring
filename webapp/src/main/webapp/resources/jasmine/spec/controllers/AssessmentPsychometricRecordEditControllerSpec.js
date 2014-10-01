describe('AssessmentPsychometricRecordEditController ', function() {
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
  
  
  var unsavedPsychometricFileGroup = {
		  "psychometricRecordId" : "psychometricRecord_id",
		  "name" : "New Psychometric Group",
          "gridFiles" : sampleGridFiles
        };
  
  var savedPsychometricRecord = {
          "id" : "psyrec_12345",
		  "publishingRecordId" : "publishingRecord_id",
          "version" : "1.0",
          "lastUploadDate" : "1395181537655"
        };
  
  var savedPsychometricFileGroup = {
          "id" : "psyFileGroup_12345",
          "psychometricRecordId" : "psychometricRecord_id",
          "name" : "Saved Psychometric Group",
          "gridFiles" : sampleGridFiles
        };
  
  var savedPsychometricFileGroup2 = {
          "id" : "psyFileGroup_67890",
          "psychometricRecordId" : "psychometricRecord_id",
          "name" : "Saved Psychometric Group 2",
          "gridFiles" : sampleGridFiles
        };
  
  var savedPublishingRecord = {
		  "id" : "publishingRecord_id"
  }
  
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

        var mockForm = {};
        mockForm.$setPristine = function(){};
        scope.editableForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        fileGroupService = FileGroupService;
        
        // create controller
        $controller('AssessmentPsychometricRecordEditController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: {id : "assessment_id"} },
            loadedPublishingRecord : { errors: [], data: {id : "publishingRecord_id"} },
            loadedRecord : { errors: [], data: savedPsychometricRecord },
            loadedFileGroup : { errors: [], data: savedPsychometricFileGroup },
            formAction:{ errors: [], data: "Edit" },
            fileGroupService: FileGroupService
      });
        
  }));
  
  it('saves a new psychometric file group and updates record', function() {
	  spyOn(fileGroupService, "savePsychometricRecord").andCallThrough();
      spyOn(fileGroupService, "save").andCallThrough();
      
      scope.docType = "psychometric";
      scope.fileRecord = savedPsychometricRecord;
      
      scope.fileGroup = unsavedPsychometricFileGroup;
      scope.assessment = {"id": "assessmentId"};
      
      httpMock.expectGET(/^fileGroup\/psychometricRecord/).respond(savedPsychometricRecord);
      httpMock.expectPOST(/^fileGroup\/psychometricRecord/).respond(savedPsychometricRecord);
      httpMock.expectPOST(/^fileGroup/).respond(savedPsychometricRecord);
      
      scope.save();
      httpMock.flush();

      expect(fileGroupService.savePsychometricRecord).toHaveBeenCalledWith(savedPsychometricRecord, savedPublishingRecord);
      expect(fileGroupService.save).toHaveBeenCalledWith(unsavedPsychometricFileGroup);
      expect(scope.errors.length).toBe(0);
  });
  
});
