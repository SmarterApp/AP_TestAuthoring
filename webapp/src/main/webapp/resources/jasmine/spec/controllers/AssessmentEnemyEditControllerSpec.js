describe('AssessmentEnemyEditController ', function() {
  var scope = null;
  var state = null;
  var enemyService = null;
  var windowMock = null;
  var q = null;
  
  var unsavedEnemy = {
          "assessmentId" : "myAssessmentId",
          "objectId1": "item-1",
          "objectType1": "Item",
          "objectId2": "item-group-1",
          "objectType2": "ITEM_GROUP"
  };
  
  var savedEnemy = {
          "id" : "newId",
          "assessmentId" : "myAssessmentId",
          "objectId1": "item-1",
          "objectType1": "Item",
          "objectId2": "item-group-1",
          "objectType2": "ITEM_GROUP"
  };
  
  var existingEnemy = {
          "id" : "id_12345",
          "assessmentId" : "myAssessmentId",
          "objectId1": "item-2",
          "objectType1": "Item",
          "object1": { "id": "item-2", "name": "item-2-name" },
          "objectId2": "item-group-2",
          "objectType2": "Item Group",
          "object2": { "id": "item-group-2", "name": "item-group-2-name" }
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
        httpMock.whenGET(/\.html/).respond("");

        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Enemy List", select:"assessmenthome.enemy", active:false }];
        scope.tabIndexes = {ENEMY:0};

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
        
        enemyService = EnemyService;
        
        // create controller
        $controller('AssessmentEnemyEditController', {
            $scope : scope,
            $window : windowMock,
            enemyService: EnemyService,
            loadedData: {data:{}, errors:[]},
            loadedEnemy: {data:{}, errors:[]},
            loadedEnemyTypes: {data:{"searchResults" : []}, errors:[]},
            loadedItemGroups: {data:{"searchResults" : []}, errors:[]},
      });
        
  }));

  
  it('toggles saving indicator when save() is called', function() {
      spyOn(enemyService, "save").andCallThrough();

      expect(scope.savingIndicator).toEqual(false);
      httpMock.expectPOST(/^enemy/).respond(savedEnemy);
      
      scope.save(unsavedEnemy);

      expect(scope.savingIndicator).toEqual(true);
      httpMock.flush();
      expect(scope.savingIndicator).toEqual(false);
  });
  
  it('populates form correctly when save() called', function() {
      spyOn(enemyService, "save").andCallThrough();
      scope.editableForm.isPristine = false;
      
      expect(scope.editableForm.isPristine).toBe(false);
      scope.enemy = unsavedEnemy;
      
      httpMock.expectPOST(/^enemy/).respond(savedEnemy);
      
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(0);
      expect(scope.editableForm.isPristine).toBe(true);
      expect(scope.enemy).toEqual(savedEnemy);
  });
  
  it('handles errors correctly when enemyService.save() fails', function() {
      spyOn(enemyService, "save").andCallThrough();
      
      scope.editableForm.isPristine = false;
      scope.enemy = existingEnemy;
      
      httpMock.expectPUT(/^enemy\/id_12345/).respond(400, {"messages" : {"duplicateKey" : [ "Items are already enemies for this assessment." ] } });
      scope.save();
      httpMock.flush();
      
      expect(scope.errors.length).toBe(1);
      expect(scope.editableForm.isPristine).toBe(false);
      expect(scope.enemy).toEqual(existingEnemy);
  });
  
  it('clears enemies correctly', function() {      
      scope.enemy = angular.copy(existingEnemy);
      scope.clearEnemy1();
      expect(scope.enemy.object1).toBe(null);
      expect(scope.enemy.objectId1).toBe(null);
      expect(scope.enemy.object2).not.toBe(null);
      expect(scope.enemy.objectId2).not.toBe(null);
      
      scope.clearEnemy2();
      expect(scope.enemy.object1).toBe(null);
      expect(scope.enemy.objectId1).toBe(null);
      expect(scope.enemy.object2).toBe(null);
      expect(scope.enemy.objectId2).toBe(null);
  });
  
  it('changes enemies correctly', function() {  
      var newItem = {"id":"new-id", "tibIdentifier":"new-item-id", "name": "new-name"};
      var newItemGroup = {"id":"new-group-id", "groupName":"new-group-name"};
      
      scope.enemy = angular.copy(existingEnemy);
      scope.changeObject1(newItem,'Item');
      expect(scope.enemy.objectId1).toBe("new-item-id");
      expect(scope.enemy.objectId2).toBe("item-group-2");
      
      scope.enemy = angular.copy(existingEnemy);
      scope.changeObject2(newItem,'Item');
      expect(scope.enemy.objectId1).toBe("item-2");
      expect(scope.enemy.objectId2).toBe("new-item-id");
      
      scope.enemy = angular.copy(existingEnemy);
      scope.changeObject2(newItemGroup,'Item Group');
      expect(scope.enemy.objectId1).toBe("item-2");
      expect(scope.enemy.objectId2).toBe("new-group-id");
      
      scope.enemy = angular.copy(existingEnemy);
      scope.changeObject2(newItemGroup,'xxx');
      expect(scope.enemy.objectId1).toBe("item-2");
      expect(scope.enemy.objectId2).toBe(null);
  });
  
});
