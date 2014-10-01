describe('AssessmentFormPartitionController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var q;
  var formPartitionService = null;

  var savedFormPartition = {
          "id" : "id_12345",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
  };
  
  var savedFormPartition2 = {
          "id" : "id_67890",
		  "formId" : "formId",
		  "name" : "form-name",
          "segmentId" : "segmentId"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, FormPartitionService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");        
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"FormPartition List", select:"assessmenthome.formpartition", active:false }];
        scope.tabIndexes = {FORM:0};

        windowMock = $window;
        q = $q;
        
        formPartitionService = FormPartitionService;
        
        // create controller
        $controller('AssessmentFormPartitionController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            loadedFormList: {data:{}, errors:[]},
            formPartitionService: FormPartitionService,
      });
        
  }));

  it('calls correct service when searchFormPartitions() called', function(){
      spyOn(formPartitionService, "search");
      var searchParams = { "name": "name-1" };
      scope.searchFormPartitions(searchParams);
      expect(formPartitionService.search).toHaveBeenCalledWith(searchParams);
  });

  it('transitions to formPartition details page when view() called', function(){
      spyOn(state, "transitionTo");
      scope.assessment = { id: "assessmentId" };
      var formPartition = { "id": "myFormPartitionId", "formId": "formId" };
      scope.view(formPartition);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.formhome.partitionedit', {"assessmentId":"assessmentId", "formId":"formId", "formPartitionId":"myFormPartitionId"});
  });

  it('deletes formPartition by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(formPartitionService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      scope.assessment = { id: "assessmentId" };
      scope.form = { id: "formId" };

      httpMock.expectDELETE(/formPartition/).respond("");
      
      scope.remove(savedFormPartition);
      httpMock.flush();
      
      expect(formPartitionService.remove).toHaveBeenCalledWith(savedFormPartition);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-formpartition-search');
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(formPartitionService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();

      savedFormPartition2.id = null;
      httpMock.expectDELETE(/formPartition/).respond(400, {"messages" : {"formPartitionId" : [ "Invalid Form Partition ID." ]} });
      
      scope.remove(savedFormPartition2);
      httpMock.flush();
      
      expect(formPartitionService.remove).toHaveBeenCalledWith(savedFormPartition2);
      expect(scope.errors).toEqual( ["Invalid Form Partition ID."] );
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-formpartition-search');

  });
});
