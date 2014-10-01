describe('PublicationFormController ', function() {
  var scope = null;
  var state = null;
  var publicationService = null;
  var coreStandardsService = null;
  var windowMock = null;
  var q = null;
  
  var publisherList = [ {"key":"publisher1", "name":"publisherName1"},
                        {"key":"publisher2", "name":"publisherName2"}
                      ];
  
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
  
  var unsavedPublication = {
          "name" : "Math Publication",
          "subject" : subject,
          "description" : "Publication of Mathematics.",
          "coreStandardsPublicationKey" : "key1"
        };
  
  var savedPublication = {
          "id" : "newId",
          "name" : "Math Publication",
          "subject" : subject,
          "description" : "Publication of Mathematics.",
          "coreStandardsPublicationKey" : "key1",
          "version":2
       };
  
  var existingPublication = {
          "id" : "id_12345",
          "name" : "Chemistry Publication",
          "subject" : scienceSubject,
          "description" : "This is a Chemistry Publication.",
          "coreStandardsPublicationKey" : "key2"
        };
  
  var publicationList = [ savedPublication, existingPublication ];
  
  var editableObject = {};
  editableObject.$setViewValue = function(val){}; 
  
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, PublicationService, CoreStandardsService) {
     
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.selectedTenantName={"name":"WI"};

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
        
        windowMock = $window;
        q = $q;
        
        publicationService = PublicationService;
        coreStandardsService = CoreStandardsService;
        
        // create controller
        $controller('PublicationFormController', {
            $scope : scope,
            $window : windowMock,
            PublicationService: publicationService,
            CoreStandardsService: coreStandardsService,
            loadedData: {data:{}, errors:[]},
        	formAction: 'Edit'
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(publicationService, "save").andCallThrough();
      
      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectPOST(/^publication/).respond(savedPublication);
      scope.save(unsavedPublication);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(publicationService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.publication = unsavedPublication;
      scope.selectedTenantName ={"name":"AK","description":"State"};
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectPOST(/^publication/).respond(savedPublication);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.publication).toBe(savedPublication);
  });
  
  it('handles errors correctly when publicationService.save() fails', function() {
      spyOn(publicationService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.publication = existingPublication;
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectPUT(/^publication/).respond(400, {"messages" : {"duplicateKey" : [ "Publication already exists in this tenant for Core Standards Publication: " + existingPublication.coreStandardsPublicationKey + "." ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.publication).toBe(existingPublication);
  });
  
  it('populates publication list with results of service call', function() {    
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      scope.publication.coreStandardsSubjectKey = "selectedSubjectKey";
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publication/).respond({"payload": publicationList});
      scope.loadCsPublications(false);
      httpMock.flush();
      
      expect(scope.coreStandardPublications).toBe(publicationList);
  });
  
  it('clears publication list when no subject/publisher selected', function() {    
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = null;
      scope.publication.coreStandardsSubjectKey = "selectedSubjectKey";
      scope.loadCsPublications(false);
      expect(scope.coreStandardPublications).toEqual([]);
    });
  
  it('does not clear selected publication when loadCsPublications(false) is invoked', function() {
      spyOn(coreStandardsService, "search").andCallThrough();
      
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      scope.publication.coreStandardsSubjectKey = "selectedSubjectKey";
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publication/).respond(publicationList);
      scope.loadCsPublications(false);
      httpMock.flush();

      var expectedSearchParams = { "hierarchy":"publication", "publisher":"selectedPublisherKey", "subject":"selectedSubjectKey" };
      expect(coreStandardsService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.publication.coreStandardsPublicationKey).toBe("key2");
  });
  
  it('clears selected publication when loadCsPublications(true) is invoked', function() {
      scope.editableForm.coreStandardsPublicationKey = editableObject;
      spyOn(coreStandardsService, "search").andCallThrough();
      spyOn(scope.editableForm.coreStandardsPublicationKey, "$setViewValue");
      
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      scope.publication.coreStandardsSubjectKey = "selectedSubjectKey";
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publication/).respond(publicationList);
      scope.loadCsPublications(true);
      httpMock.flush();

      var expectedSearchParams = { "hierarchy":"publication", "publisher":"selectedPublisherKey", "subject":"selectedSubjectKey" };
      expect(coreStandardsService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.editableForm.coreStandardsPublicationKey.$setViewValue).toHaveBeenCalledWith(null);
      expect(scope.publication.coreStandardsPublicationKey).toBe(null);
  });
  
  it('populates subject list with results of service call', function() {    
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=subject/).respond({"payload": subjectList});
      scope.loadCsSubjects(false);
      httpMock.flush();
      
      expect(scope.coreStandardSubjects).toEqual(subjectList);
  });
  
  it('clears subject list when no publisher selected', function() {    
      scope.publication = existingPublication;
      scope.publication.coreStandardsPublisherKey = null;
      scope.loadCsSubjects(false);
      expect(scope.coreStandardSubjects).toEqual([]);
    });
  
  it('does not clear selected subject when loadCsSubjects(false) is invoked', function() {
      spyOn(coreStandardsService, "search").andCallThrough();
      
      scope.publication.coreStandardsSubjectKey = "keyA";
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=subject/).respond(subjectList);
      scope.loadCsSubjects(false);
      httpMock.flush();

      var expectedSearchParams = { "hierarchy":"subject", "publisher":"selectedPublisherKey" };
      expect(coreStandardsService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.publication.coreStandardsSubjectKey).toBe("keyA");
  });
  
  it('clears selected subject when loadCsSubjects(true) is invoked', function() {
      scope.editableForm.coreStandardsSubjectKey = editableObject;
      spyOn(coreStandardsService, "search").andCallThrough();
      spyOn(scope.editableForm.coreStandardsSubjectKey, "$setViewValue");
      
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=publisher/).respond(publisherList);
      httpMock.expectGET(/^coreStandard\/(.*)hierarchy=subject/).respond(subjectList);
      
      scope.publication.coreStandardsSubjectKey = "keyA";
      scope.publication.coreStandardsPublisherKey = "selectedPublisherKey";
      scope.loadCsSubjects(true);
      scope.$root.$digest();

      var expectedSearchParams = { "hierarchy":"subject", "publisher":"selectedPublisherKey" };
      expect(coreStandardsService.search).toHaveBeenCalledWith(expectedSearchParams);
      expect(scope.editableForm.coreStandardsSubjectKey.$setViewValue).toHaveBeenCalledWith(null);
      expect(scope.publication.coreStandardsSubjectKey).toBe(null);
  });
  
  it('converts empty subject list to empty select2 array', function() {
      var subjectList = [];
      var select2List = scope.convertSubjectsToSelect2Array(subjectList);
      expect(select2List).toEqual([]);
  });
  
  it('converts empty subject list to empty select2 array', function() {
      var subjectList = [subject,scienceSubject];
      var select2List = scope.convertSubjectsToSelect2Array(subjectList);
      expect(select2List).toEqual([{"id":subject,"text":"Mathematics"},{"id":scienceSubject,"text":"Chemistry"}]);
  });
  
  it('displays core standards publication correctly', function() {
      var display = scope.getPublicationDisplay(savedPublication);
      expect(display).toBe("V2-Publication of Mathematics.");
  });

});

