testauth.controller('AssessmentEnemyEditController',['$scope','$state', 'loadedData', 'loadedEnemy', 'loadedEnemyTypes', 'EnemyService',
    function($scope, $state, loadedData, loadedEnemy, loadedEnemyTypes, EnemyService) {
        $scope.savingIndicator = false;
        $scope.errors = loadedData.errors;
        $scope.searchResponse = {};
        $scope.assessment = loadedData.data;
        $scope.enemyTypes = loadedEnemyTypes.data;
        $scope.enemy = loadedEnemy.data;
        $scope.enemy.assessmentId = $scope.assessment.id;
       
        $scope.actionButton = '';
        $scope.formAction = 'Add';
        if ($scope.enemy && $scope.enemy.id) {
            $scope.formAction = 'Edit';
            $scope.isNew = false;
        } else {
        	 $scope.isNew = true;
        }
       
        $scope.save = function() {
            $scope.savingIndicator = true;
            
            return EnemyService.save($scope.enemy).then(function(response) {
                $scope.savingIndicator = false;
                $scope.errors = response.errors;
                $scope.messages = response.messages;
                $scope.errorsMap = response.messages;
                if ($scope.errors.length == 0) {
                    $scope.editableForm.$setPristine();
                    $scope.enemy = response.data;
                    $scope.isNew = false;
                    $state.transitionTo("assessmenthome.itempool.enemyedit", {assessmentId:$scope.assessment.id, enemyId:$scope.enemy.id});
                } else {
					angular.forEach($scope.errorsMap, function(msg,key){
						var fieldName = key + "";
						var message = msg + "";
						$scope.editableForm.$setError(fieldName, message);
					});
					return "Error";
				}
            });
        };
        
        $scope.back = function() {
            $scope.actionButton = 'cancel';
            $state.transitionTo("assessmenthome.itempool.enemy", {assessmentId:$scope.assessment.id});
        };
        
        $scope.edit = function() {
            $scope.originalEnemy = angular.copy($scope.enemy);
            $scope.editableForm.$show();
        };
        
        $scope.cancel = function() {
            $scope.enemy = angular.copy($scope.originalEnemy);
            $scope.editableForm.$setPristine();
            $scope.editableForm.$cancel();
            $scope.messages = {};
            $scope.errors = [];
            $scope.errorsMap = {};
        };
        
        $scope.clearEnemy1 = function(data){
        	$scope.enemy.objectType1 = data;
            $scope.enemy.object1 = null;
            $scope.enemy.objectId1 = null;
        };
        
        $scope.clearEnemy2 = function(data){
        	$scope.enemy.objectType2 = data;
            $scope.enemy.object2 = null;
            $scope.enemy.objectId2 = null;
        };
        
        $scope.changeObject1 = function(newObject,type){
            if(newObject){
                if (type == 'Item') {
                    $scope.enemy.objectId1 = newObject.tibIdentifier;
                } else if (type == 'Item Group') {
                    $scope.enemy.objectId1 = newObject.id;
                } else {
                    $scope.enemy.objectId1 = null;
                }
            }else{
                $scope.enemy.objectId1 = null;
            }
        };
        
        $scope.changeObject2 = function(newObject,type){
            if(newObject){
                if (type == 'Item') {
                    $scope.enemy.objectId2 = newObject.tibIdentifier;
                } else if (type == 'Item Group') {
                    $scope.enemy.objectId2 = newObject.id;
                } else {
                    $scope.enemy.objectId2 = null;
                }
            }else{
                $scope.enemy.objectId2 = null;
            }
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.editableForm.$dirty && $scope.actionButton != 'cancel') {
                if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                    event.preventDefault();
                }
            }
        });

    }]);
