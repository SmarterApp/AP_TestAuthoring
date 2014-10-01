testauth.controller('AssessmentEnemyController',['$scope','$state', 'loadedData', 'loadedEnemyTypes', 'EnemyService',
    function($scope, $state, loadedData, loadedEnemyTypes, EnemyService) {
        $scope.errors = loadedData.errors;
        $scope.enemyTypes = loadedEnemyTypes.data;
        $scope.assessment = loadedData.data;
        
        if (!$state.current.searchParams) {
            $scope.searchParams = {"assessmentId": $scope.assessment.id, "currentPage": 1, "pageSize":"50", "sortKey":"objectId1"};
        } else {
            $scope.searchParams = $state.current.searchParams;
        }
        $scope.searchResponse = {};

        $scope.searchEnemies = function(params) {
            return EnemyService.search(params);
        };
        
        $scope.createNewItem = function() {
            var params = {};
            angular.copy($scope.searchParams, params);
            params.assessmentId = $scope.assessment.id;
            params.segmentId = "";
            $state.transitionTo("assessmenthome.itempool.enemyedit", params);
        };

        $scope.view = function(enemy) {
            $state.transitionTo("assessmenthome.itempool.enemyedit", {assessmentId:$scope.assessment.id, enemyId:enemy.id});
        };
        
        $scope.viewDetails = function(enemyType,enemy) {
            $scope.showDetails = true;
            $scope.detailEnemyType = enemyType;
            $scope.detailEnemy = enemy;
        };
        
        $scope.closeDetails = function() {
            $scope.showDetails = false;
        };
        
        $scope.remove = function(enemy) {
            if (confirm("Are you sure you want to delete this enemy?")) {
                EnemyService.remove(enemy).then(function(response) {
                    $scope.errors = response.errors;
                    if (!$scope.errors || $scope.errors.length == 0) {
                        $scope.$broadcast('initiate-enemy-search');
                    }
                });
            };
        };
        
        $scope.clearObjectIdSearch = function(){
            $scope.searchParams.objectIdSearch = null;
        };
        
        $scope.changeObjectIdSearch = function(newObject,type){
            if(newObject){
                if (type == 'Item') {
                    $scope.searchParams.objectIdSearch = newObject.tibIdentifier;
                } else if (type == 'Item Group') {
                    $scope.searchParams.objectIdSearch = newObject.id;
                } else {
                    $scope.searchParams.objectIdSearch = null;
                }
            }else{
                $scope.searchParams.objectIdSearch = null;
            }
        };

    }
]);

