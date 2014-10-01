testauth.factory("EnemyService", function($http){
	var service = {
		getResource : function() {
			return 'enemy';
		},
		
		getEnemyTypes : function() {
            return this.getHttp().get(baseUrl + this.getResource() + '/enemyTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        },

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
    };
	return angular.extend(service, BaseService);
});
