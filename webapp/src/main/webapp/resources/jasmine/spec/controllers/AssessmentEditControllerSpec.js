describe('AssessmentEditController', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var publicationService = null;
  var coreStandardsService = null;
  var q = null;
  
  var mathSubject = {
          "id": "subjectId1", 
          "name": "Mathematics", 
		  "abbreviation": "MATH",
		  "description": "This is a course about numbers."
  };
  
  var savedPublishingRecord = {
          "id" : "id_12345",
          "version" : "1.1",
          "status" : "INPROGRESS"
        };
  
  var chemistrySubject = {
		  "id": "subjectId2",
		  "name": "Chemistry", 
		  "abbreviation": "CHEM",
		  "description": "This is a course about mixing stuff."
  };
  
  var subjectList = [ mathSubject, chemistrySubject ];
  
  var mathPublication = {
          "id" : "id_12345",
          "name" : "Math Publication",
          "subject" : mathSubject,
          "description" : "This is a Math Publication.",
          "coreStandardsPublicationKey" : "SBAC-MA-v1"
  };
  
  var existingGrade = {
          "value" : "1",
          "title" : "1"
  };
  
  var unsavedAssessment = {
          "name" : "Assessment-1",
          "subjectId" : "12345",
          "publisher" : "Jasmine",
          "purpose" : "REGISTRATION"
  };
  
  var savedAssessment = {
          "id" : "newId",
          "name" : "Assessment-1",
          "subjectId" : "12345",
          "publisher" : "Jasmine",
          "purpose" : "REGISTRATION"
  };
  
  var existingAssessment = {
          "id" : "id_12345",
          "name" : "Assessment-X",
          "subject" : chemistrySubject,
          "publisher" : "Jasmine",
          "purpose" : "ADMINISTRATION"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, AssessmentService, PublicationService, CoreStandardsService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        httpMock.expectGET(/^publication\/assignedSubjects/).respond(subjectList);
        httpMock.expectGET(/^assessment\/type/).respond(["type1","type2"]);
        
        // initiate required variables
        state = $state;
        state.current = {};

        var mockForm = { isPristine: true };
        mockForm.$setPristine = function(){ this.isPristine = true; };
        mockForm.$setError = function(fieldname, msg){
            angular.forEach(this.$editables, function(editable) {
                if(!name || editable.name === name) {
                  editable.setError(msg);
                }
              });
        };
        mockForm.publicationId = {
            $setViewValue: function(val) {}
        };
        scope.editableForm = mockForm;
        
        windowMock = $window;
        q = $q;
        
        publicationService = PublicationService;
        coreStandardsService = CoreStandardsService;
        
        // create controller
        $controller('AssessmentEditController', {
            $scope : scope,
            $window : windowMock,
            referenceData:["K","1","2"],
            publicationService: PublicationService,
            coreStandardsService: CoreStandardsService,
            loadedData: {data:{}, errors:[]},
            loadedPublishingRecord: {errors:[], data:savedPublishingRecord}
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
	  httpMock.expectPOST(/^assessment/).respond(201,savedAssessment);
	  expect(scope.savingIndicator).toEqual(false);
      scope.save(unsavedAssessment);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
	  httpMock.expectPOST(/^assessment/).respond(201,savedAssessment);
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.assessment = unsavedAssessment;
      scope.save();
      httpMock.flush();
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.assessment).toBe(savedAssessment);
  });
  
  it('handles errors correctly when AssessmentService.save() fails', function() {
      
	  httpMock.expectPUT(/^assessment\/id_12345/).respond(400,{
		  "messages" : {
			    "publicationId" : [ "Publication is required" ],
			  }
			});
      
      scope.editableForm.isPristine = false;
      scope.assessment = existingAssessment;
      scope.save();
      
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.assessment).toBe(existingAssessment);
  });
  
  
  it('populates publication list with results of service call', function() {    
      scope.publication = mathPublication;
      scope.assessment.subjectId = mathSubject.id;
      
      httpMock.expectGET(/^publication/).respond({"searchResults": [{"id":"1", "name":"pub1"},{"id":"2", "name":"pub2"}] });
      
      scope.loadPublications(false); 
      httpMock.flush();
      
      expect(scope.publications).toEqual([{"id":"1", "name":"pub1"},{"id":"2", "name":"pub2"}]);
  });
  
  it('clears publication list when no subject/publisher selected', function() {    
      scope.publication = mathPublication;
      scope.publication.coreStandardsPublisherKey = null;
      scope.publication.coreStandardsSubjectKey = "selectedSubjectKey";
      scope.loadPublications(false);
      expect(scope.publications).toEqual([]);
  });
  
  it('does not clear selected publication when loadPublications(false) is invoked', function() {
      spyOn(publicationService, "search").andCallThrough();
      
      scope.assessment.subjectId = mathSubject.id;
      scope.publication = mathPublication;
      
      httpMock.expectGET(/^publication/).respond([{"id":"1", "name":"pub1"},{"id":"2", "name":"pub2"}]);
      
      scope.loadPublications(false);

      var expectedSearchParams = { "hierarchy":"publication", "subjectIds": mathSubject.id };
      expect(publicationService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.publication.coreStandardsPublicationKey).toBe("SBAC-MA-v1");
  });
  
  it('clears selected publication when loadPublications(true) is invoked', function() {
      spyOn(publicationService, "search").andCallThrough();
      
      scope.assessment.subjectId = mathSubject.id;
      scope.publication = mathPublication;
      
      httpMock.expectGET(/^publication/).respond([{"id":"1", "name":"pub1"},{"id":"2", "name":"pub2"}]);
      
      scope.loadPublications(true);
      httpMock.flush();

      var expectedSearchParams = { "hierarchy":"publication", "subjectIds": mathSubject.id };
      expect(publicationService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.assessment.publicationId).toBe(null);
  });
  
  it('populates grade list with results of service call', function() {    
      scope.assessment.subjectId = mathSubject.id;
      scope.assessment.publicationId = mathPublication.id;
      scope.assessment.publication = mathPublication;
      scope.publication = mathPublication;
      scope.grade = existingGrade;
      
      httpMock.expectGET(/^coreStandard\/publication\/SBAC-MA-v1\/grade/).respond( { "payload":"cs payload response" } );
      
      scope.loadGrades(false);
      httpMock.flush();
      
      expect(scope.grades).toBe("cs payload response");
  });
  
  it('clears grade list when no subject/publication selected', function() {    
      scope.grade = existingGrade;
      scope.assessment.subjectId = mathSubject.id;
      scope.assessment.publicationId = null;
      scope.publication = mathPublication;
      scope.grade = existingGrade;
      
      scope.loadGrades(false);
      expect(scope.grades).toEqual([]);
  });
  
  it('does not clear selected grade when loadGrades(false) is invoked', function() {
      spyOn(coreStandardsService, "searchGradeByPublication").andCallThrough();
      
      scope.assessment.subjectId = mathSubject.id;
      scope.assessment.publicationId = mathPublication.id;
      scope.assessment.publication = mathPublication;
      scope.publication = mathPublication;
      scope.grade = existingGrade;
      
      httpMock.expectGET(/^coreStandard\/publication\/SBAC-MA-v1\/grade/).respond({ "errors": [], data: { "payload":"cs payload response" } });
      
      scope.loadGrades(false);

      var expectedSearchParams = { "publicationKey":"SBAC-MA-v1" };
      expect(coreStandardsService.searchGradeByPublication).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.grade.value).toBe("1");
  });
  
  it('clears selected grade when loadGrades(true) is invoked', function() {
      spyOn(coreStandardsService, "searchGradeByPublication").andCallThrough();
      
      scope.assessment.subjectId = mathSubject.id;
      scope.assessment.publicationId = mathPublication.id;
      scope.assessment.publication = mathPublication;
      scope.publication = mathPublication;
      scope.publications = [];
      scope.publications.push(mathPublication);
      scope.grade = existingGrade;
      
      httpMock.expectGET(/^coreStandard\/publication\/SBAC-MA-v1\/grade/).respond({ "errors": [], data: { "payload":"cs payload response" } });
      
      scope.loadGrades(true);

      var expectedSearchParams = { "publicationKey":"SBAC-MA-v1" };
      expect(coreStandardsService.searchGradeByPublication).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.assessment.grade).toBe(null);
  });
  
});

