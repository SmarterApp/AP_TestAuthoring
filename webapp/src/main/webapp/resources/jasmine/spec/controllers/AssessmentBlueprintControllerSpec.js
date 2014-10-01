describe('AssessmentBlueprintController ', function() {
  var scope = null;
  var state = null;
  var blueprintElementService = null;
  
  var mockBlueprintElements = [
       {
          "id":"bpElement1",
          "assessmentId":"assessment1",
          "standardKey":"standard-key",
          "level":"1",
          "grade":"4",
          "active":true,
          "blueprintElementValueMap":{
             "MASTER":{
                "operationalItemMinValue":0,
                "operationalItemMaxValue":0,
                "fieldTestItemMinValue":0,
                "fieldTestItemMaxValue":0,
                "itemSelectionParameters":null,
                "itemSelectionParameterCount":0
             }
          }
       },
       {
          "id":"bpElement2",
          "assessmentId":"assessment1",
          "standardKey":"standard-key",
          "level":"1",
          "grade":"4",
          "active":true,
          "blueprintElementValueMap":{
             "MASTER":{
                "operationalItemMinValue":0,
                "operationalItemMaxValue":0,
                "fieldTestItemMinValue":0,
                "fieldTestItemMaxValue":0,
                "itemSelectionParameters":null,
                "itemSelectionParameterCount":0
             }
          }
       }
  ];
  
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, BlueprintElementService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        scope.tabs = [{ label:"Blueprint", select:"assessmenthome.blueprint", active:false }];
        scope.tabIndexes = {BLUEPRINT:0};
        
        // initiate required variables
        state = $state;
        state.current = {};
        q = $q;
        
        blueprintElementService = BlueprintElementService;
        
        // create controller
        $controller('AssessmentBlueprintController', {
            $scope : scope,
            loadedData : { errors: [], data: { "id":"assessment1", "publication": { "coreStandardsPublicationKey" : "CC-ELA-v1" } } },
            BlueprintElementService: blueprintElementService,
      });
        
  }));

  it('calls correct service when searchBlueprintElements() called', function(){
      var searchParams = { "name": "searchName" };
      var returnedPromise = scope.searchBlueprintElements(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBeDefined();
          expect(response.errors).toEqual([]);
      });
  });
  
  
  it('does not call service saveAll() called with empty list', function(){
      spyOn(blueprintElementService, "updateCollection");
      var blueprintElements = null;
      scope.saveAll(blueprintElements);
      expect(blueprintElementService.updateCollection).not.toHaveBeenCalled();
  });
  
  it('calls service for each blueprintElement when saveAll() called', function(){
      spyOn(blueprintElementService, "updateCollection").andCallThrough();
      scope.searchParams.selectedBlueprint = 'MASTER';
      scope.saveAll(mockBlueprintElements);
      expect(blueprintElementService.updateCollection).toHaveBeenCalled();
  });
  
  it('does not call service when a blueprintElement has non-integer min/max field', function(){
      mockBlueprintElements[0].blueprintElementValueMap['MASTER'].fieldTestItemMinValue = "1.5";
      spyOn(blueprintElementService, "updateCollection");
      
      httpMock.expectPUT('blueprintElement/assessment1/synch').respond("");
      httpMock.expectGET('coreStandard/publication/CC-ELA-v1/grade?publicationKey=CC-ELA-v1').respond("");
      httpMock.expectGET(/segment?/).respond("");
      httpMock.expectGET(/^assessment\/assessment1\/validateblueprint/).respond({});
      httpMock.flush();

      scope.saveAll(mockBlueprintElements);
      expect(blueprintElementService.updateCollection).not.toHaveBeenCalled();
      expect(scope.errors).toContain("Field Test Item Min value must be a positive integer");
  });
  
  it('collapses blueprint element correctly', function(){
      var bpElem = {"id":"abc","standardKey":"element1","grade":3,"extraField":"blah"};
      var bpElem2 = {"id":"xyz","standardKey":"element2","grade":3};
      scope.collapse(bpElem);
      scope.collapse(bpElem2);
      expect(scope.collapsedElements.length).toBe(2);
      expect(scope.collapsedElements[0]).toEqual({"id":"abc","standardKey":"element1","grade":3});
      expect(scope.collapsedElements[1]).toEqual({"id":"xyz","standardKey":"element2","grade":3});
      expect(scope.isCollapsed(bpElem)).toBe(true);
      expect(scope.isCollapsed(bpElem2)).toBe(true);
  });
  
  it('collapses blueprint element in different grades correctly', function(){
      var bpElem = {"id":"abc","standardKey":"element1","grade":3,"extraField":"blah"};
      var bpElem2 = {"id":"xyz","standardKey":"element1","grade":4};
      scope.collapse(bpElem2);
      expect(scope.collapsedElements.length).toBe(1);
      expect(scope.collapsedElements[0]).toEqual({"id":"xyz","standardKey":"element1","grade":4});
      expect(scope.isCollapsed(bpElem)).toBe(false);
      expect(scope.isCollapsed(bpElem2)).toBe(true);
  });
  
  it('expands blueprint element correctly', function(){
      var bpElem = {"id":"abc","standardKey":"element1","grade":3};
      var bpElem2 = {"id":"xyz","standardKey":"element2","grade":3};
      scope.collapsedElements = [bpElem,bpElem2];
      
      scope.expand({"id":"abc","standardKey":"element1","grade":3});
      expect(scope.collapsedElements.length).toBe(1);
      expect(scope.collapsedElements[0]).toEqual(bpElem2);
      expect(scope.isCollapsed(bpElem)).toBe(false);
      expect(scope.isCollapsed(bpElem2)).toBe(true);
  });
  
  it('expands missing blueprint element correctly', function(){
      var bpElem = {"id":"abc","standardKey":"element1","grade":3};
      var bpElem2 = {"id":"xyz","standardKey":"element2","grade":3};
      scope.collapsedElements = [bpElem,bpElem2];
      
      scope.expand({"id":"123","standardKey":"elementX","grade":3});
      expect(scope.collapsedElements.length).toBe(2);
      expect(scope.collapsedElements[0]).toEqual(bpElem);
      expect(scope.collapsedElements[1]).toEqual(bpElem2);
      expect(scope.isCollapsed(bpElem)).toBe(true);
      expect(scope.isCollapsed(bpElem2)).toBe(true);
  });
  
  it('checks if parent is collapsed', function(){
      scope.collapsedElements = [ {"standardKey":"alpha","grade":"1"},{"standardKey":"beta|pheta","grade":"1"}];
      
      var bpElem1 = {"standardKey":"alpha","grade":"1"};
      var bpElem2 = {"standardKey":"alpha|xxx","grade":"1"};
      var bpElem3 = {"standardKey":"alpha|xxx","grade":"2"};
      var bpElem4 = {"standardKey":"beta|pheta","grade":"1"};
      var bpElem5 = {"standardKey":"beta|pheta|omega","grade":"1"};
      var bpElem6 = {"standardKey":"beta|omega|pheta","grade":"1"};
      
      expect(scope.isParentCollapsed(bpElem1)).toBe(false);
      expect(scope.isParentCollapsed(bpElem2)).toBe(true);
      expect(scope.isParentCollapsed(bpElem3)).toBe(false);
      expect(scope.isParentCollapsed(bpElem4)).toBe(false);
      expect(scope.isParentCollapsed(bpElem5)).toBe(true);
      expect(scope.isParentCollapsed(bpElem6)).toBe(false);
  });
  
  it('calls activate grade service when useWidget() called with activate action', function(){
      spyOn(blueprintElementService, "activateBpElementGrades").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'activate';
      scope.widget.grades = ["1","3","5"];
      
      scope.useWidget();
      expect(blueprintElementService.activateBpElementGrades).toHaveBeenCalledWith("assessment-id",["1","3","5"],true);
  });
  
  it('calls deactivate grade service when useWidget() called with deactivate action', function(){
      spyOn(blueprintElementService, "activateBpElementGrades").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'deactivate';
      scope.widget.grades = ["1","3","5"];
      
      scope.useWidget();
      expect(blueprintElementService.activateBpElementGrades).toHaveBeenCalledWith("assessment-id",["1","3","5"],false);
  });
  
  it('calls blueprintElementService when useWidget() called with copy action', function(){
      spyOn(blueprintElementService, "addSegmentToBlueprintElementData").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'copy';
      scope.widget.fromSegmentId = "fromId";
      scope.widget.toSegmentId = "toId";
      
      scope.useWidget();
      expect(blueprintElementService.addSegmentToBlueprintElementData).toHaveBeenCalledWith("assessment-id","toId","fromId");
  });
  
  it('validates fromSegmentId is populated when useWidget() called with copy action', function(){
      spyOn(blueprintElementService, "addSegmentToBlueprintElementData").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'copy';
      scope.widget.fromSegmentId = "";
      scope.widget.toSegmentId = "toId";
      
      scope.useWidget();
      expect(scope.widget.errors.length).toBe(1);
      expect(scope.widget.errors).toContain("From Segment is required.");
      expect(blueprintElementService.addSegmentToBlueprintElementData).not.toHaveBeenCalled();
  });
  
  it('validates fromSegmentId and toSegmentId is populated when useWidget() called with copy action', function(){
      spyOn(blueprintElementService, "addSegmentToBlueprintElementData").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'copy';
      scope.widget.fromSegmentId = "";
      scope.widget.toSegmentId = null;
      
      scope.useWidget();
      expect(scope.widget.errors.length).toBe(2);
      expect(scope.widget.errors).toContain("From Segment is required.");
      expect(scope.widget.errors).toContain("To Segment is required.");
      expect(blueprintElementService.addSegmentToBlueprintElementData).not.toHaveBeenCalled();
  });
    
  it('calls blueprintElementService when useWidget() called with clear action', function(){
      spyOn(blueprintElementService, "clearBlueprint").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'clear';
      scope.widget.clearSegmentId = "segment-id";
      
      scope.useWidget();
      expect(scope.widget.errors).toEqual(null);
      expect(blueprintElementService.clearBlueprint).toHaveBeenCalledWith('assessment-id','segment-id');
  });
  
  it('validates clearSegmentId is populated when useWidget() called with clear action', function(){
      spyOn(blueprintElementService, "clearBlueprint").andCallThrough();
      scope.assessment = {id:"assessment-id"};
      scope.widget.action = 'clear';
      scope.widget.clearSegmentId = "";
      
      scope.useWidget();
      expect(scope.widget.errors.length).toBe(1);
      expect(scope.widget.errors).toContain("Segment is required.");
      expect(blueprintElementService.clearBlueprint).not.toHaveBeenCalled();
  });

  
});

