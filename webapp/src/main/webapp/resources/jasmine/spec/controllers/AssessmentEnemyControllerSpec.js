describe('AssessmentEnemyController ', function() {
  var scope = null;
  var state = null;
  var windowMock = null;
  var q;
  var enemyService = null;

  var savedEnemy = {
          "id" : "id_12345",
          "assessmentId" : "myAssessmentId",
          "objectId1": "item-1",
          "objectType1": "ITEM",
          "objectId2": "item-group-1",
          "objectType2": "ITEM_GROUP"
  };
  
  var savedEnemy2 = {
          "id" : "id_67890",
          "assessmentId" : "myAssessmentId",
          "objectId1": "item-2",
          "objectType1": "ITEM",
          "objectId2": "item-group-2",
          "objectType2": "ITEM_GROUP"
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, EnemyService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        httpMock = $injector.get('$httpBackend');
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Enemy List", select:"assessmenthome.itempool.enemy", active:false }];
        scope.tabIndexes = {ENEMY:0};

        windowMock = $window;
        q = $q;
        
        enemyService = EnemyService;
        
        // create controller
        $controller('AssessmentEnemyController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: [] },
            loadedEnemyTypes: {data:{"searchResults" : []}, errors:[]},
            loadedItemGroups: {data:{"searchResults" : []}, errors:[]},
            enemyService: EnemyService
      });
        
  }));

  it('calls correct service when searchEnemies() called', function(){
      spyOn(enemyService, "search");
      var searchParams = { "objectId1": "item-1" };
      scope.searchEnemies(searchParams);
      expect(enemyService.search).toHaveBeenCalledWith(searchParams);
  });
  

  
  it('transitions to enemy details page when view() called', function(){
      spyOn(state, "transitionTo");
      scope.assessment = { id: "myAssessmentId" };
      var enemy = { "id": "myEnemyId" };
      scope.view(enemy);
      expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.itempool.enemyedit', {"assessmentId":"myAssessmentId", "enemyId":"myEnemyId"});
  });

  it('deletes enemy by calling service and searching again', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(enemyService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      scope.assessment = { id: "myAssessmentId" };

      scope.searchResponse = {};
      scope.searchResponse.searchResults = [ savedEnemy, savedEnemy2 ];
      
      httpMock.expectDELETE(/^enemy/).respond("");
      
      scope.remove(savedEnemy);
      httpMock.flush();
      
      expect(enemyService.remove).toHaveBeenCalledWith(savedEnemy);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).toHaveBeenCalledWith('initiate-enemy-search');
  });

  it('handles delete errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(enemyService, "remove").andCallThrough();
      spyOn(scope, "$broadcast").andCallThrough();
      
      scope.remove(savedEnemy2);
      
      expect(enemyService.remove).toHaveBeenCalledWith(savedEnemy2);
      expect(scope.errors).toEqual([]);
      expect(scope.$broadcast).not.toHaveBeenCalledWith('initiate-enemy-search');

  });
});
