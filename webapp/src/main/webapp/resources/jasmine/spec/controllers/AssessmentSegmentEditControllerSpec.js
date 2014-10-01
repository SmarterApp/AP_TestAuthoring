describe('AssessmentSegmentEditController ', function() {
  var scope = null;
  var state = null;
  var segmentService = null;
  var windowMock = null;
  var q = null;
  
  var algorithmList = [ {id:"id1",name:"name1", itemSelectionAlgorithmType:"name1"}, 
                        {id:"id2",name:"name2", itemSelectionAlgorithmType:"name2"}, 
                        {id:"ft", name:"Field Test", itemSelectionAlgorithmType:"Field Test"} ];
  
  var unsavedSegment = {
          "assessmentId" : "myAssessmentId",
          "position" : "0",
          "minItems" : "0",
          "maxItems" : "10"
        };
  
  var savedSegment = {
          "id" : "newId",
          "assessmentId" : "myAssessmentId",
          "position" : "0",
          "minItems" : "0",
          "maxItems" : "10"
        };
  
  var existingSegment = {
          "id" : "id_12345",
          "assessmentId" : "myAssessmentId",
          "position" : "1",
          "minItems" : "0",
          "maxItems" : "5"
        };
  
  var item1 = { "id": "itemX", data: "this is itemX" };
  var item2 = { "id": "itemY", data: "this is itemY" };
  var item3 = { "id": "itemZ", data: "this is itemZ" };
  
  var editableObject = {};
  editableObject.$viewValue = "test";
  editableObject.$setViewValue = function(val){}; 
  
  var editableObject2 = {};
  editableObject2.$viewValue = "test";
  editableObject2.$setViewValue = function(val){}; 
  
  
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
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Segments", select:"assessmenthome.segmentedit", active:false }];
        scope.tabIndexes = {SEGMENT:0};

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
        
        segmentService = SegmentService;
        
        // create controller
        $controller('AssessmentSegmentEditController', {
            $scope : scope,
            $window : windowMock,
            segmentService: SegmentService,
            loadedData: {data:{}, errors:[]},
            loadedSegment: {data:{}, errors:[]},
            segmentList: {data:{"searchResults" : []}, errors:[]},
            algorithmList: {data:{"searchResults" : algorithmList}, errors:[]},
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(segmentService, "save").andCallThrough();
      
      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/^segment/).respond(savedSegment);
      scope.save(unsavedSegment);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(segmentService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.segment = unsavedSegment;
      
      httpMock.expectPOST(/^segment/).respond(savedSegment);
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.segment).toBe(savedSegment);
  });
  
  it('handles errors correctly when segmentService.save() fails', function() {
      spyOn(segmentService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.segment = existingSegment;
      
      httpMock.expectPUT(/^segment/).respond(400, {"messages" : {"duplicateKey" : [ "Segment already exists for the given assessment with label: " + existingSegment.label ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.segment).toBe(existingSegment);
  });
  
  
  it('updates selected item algorithm correctly', function() {
      scope.editableForm.minOpItems = editableObject;
      scope.editableForm.maxOpItems = editableObject2;
      spyOn(scope.editableForm.minOpItems, "$setViewValue");
      spyOn(scope.editableForm.maxOpItems, "$setViewValue");
      
      scope.updateSelectedAlgorithm();
      expect(scope.selectedAlgorithm).toEqual(null);
      
      scope.updateSelectedAlgorithm(null);
      expect(scope.selectedAlgorithm).toEqual(null);
      
      scope.updateSelectedAlgorithm('');
      expect(scope.selectedAlgorithm).toEqual(null);
      
      scope.updateSelectedAlgorithm('invalid-it');
      expect(scope.selectedAlgorithm).toEqual(null);
      
      scope.updateSelectedAlgorithm('id1');
      expect(scope.selectedAlgorithm).toEqual({id:'id1',name:'name1',itemSelectionAlgorithmType:"name1"});
  });
  
  it('hides min and max op fields when field test type is selected', function() {
      scope.editableForm.minOpItems = editableObject;
      scope.editableForm.maxOpItems = editableObject2;
      spyOn(scope.editableForm.minOpItems, "$setViewValue");
      spyOn(scope.editableForm.maxOpItems, "$setViewValue");
      
	  scope.updateSelectedAlgorithm("ft");
	  
	  expect(scope.lockOpItems).toEqual(true);
  	  expect(scope.editableForm.minOpItems.$setViewValue).toHaveBeenCalledWith("0");
  	  expect(scope.editableForm.maxOpItems.$setViewValue).toHaveBeenCalledWith("0");
  });
  

  it('shows min and max op fields when other types are selected', function() {
      scope.editableForm.minOpItems = editableObject;
      scope.editableForm.maxOpItems = editableObject2;
      spyOn(scope.editableForm.minOpItems, "$setViewValue");
      spyOn(scope.editableForm.maxOpItems, "$setViewValue");
      
	  scope.updateSelectedAlgorithm("id1");
	  expect(scope.lockOpItems).toEqual(false);
	  expect(scope.editableForm.minOpItems.$setViewValue).toHaveBeenCalledWith("test");
      expect(scope.editableForm.maxOpItems.$setViewValue).toHaveBeenCalledWith("test");
  });

});
