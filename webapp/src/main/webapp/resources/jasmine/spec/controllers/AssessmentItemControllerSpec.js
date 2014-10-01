describe('AssessmentItemController ', function() {
  var scope = null;
  var state = null;
  var itemService = null;
  
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, ItemService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        scope.tabs = [{ label:"Item", select:"assessmenthome.itempool", active:false }];
        scope.tabIndexes = {ITEMPOOL:0};
        
        // initiate required variables
        state = $state;
        state.current = {};
        q = $q;
        
  	    httpMock.whenGET(/segment?/).respond("");
  	  
        itemService = ItemService;
        
        
        // create controller
        $controller('AssessmentItemsController', {
            $scope : scope,
            loadedData : { errors: [], data: { "id":"assessment1", "publication": { "coreStandardsPublicationKey" : "CC-ELA-v1" } } },
            itemGroups : { errors: [], data: { "id":"group1", "groupName": "Grouper"}},
            ItemService: itemService,
            itemPoolData: { errors: [], data: {} },
            segmentListData: { errors: [], data: {} }
      });
        
        
  }));

  it('calls correct service when searchItems() called', function(){
      var searchParams = { "name": "searchName" };
      var returnedPromise = scope.searchItems(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBeDefined();
          expect(response.errors).toEqual([]);
      });
  });
  
});

