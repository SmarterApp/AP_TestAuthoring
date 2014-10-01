

testauth.factory("UserService", function($http){
	var service =   {
		getAssets : function(tenantId){
			var url = baseUrl + 'user/assets';
		    return  $http.get(url,  {params:{'tenantId': tenantId, '_': Math.random()}}).then(this.successHandler, this.errorHandler);
    	},
    	getApplicableTenants : function(){
			var url = baseUrl + 'user/applicableTenants?_=' + Math.random();
		    return  $http.get(url,  {params:{}}).then(this.successHandler, this.errorHandler);
    	},
		getCurrentUser : function(){
			var url = baseUrl + 'user/currentUser';
		    return  $http.get(url).then(this.successHandler, this.errorHandler);
    	},
		hasPermission : function(permission){
			var url = baseUrl + 'user/hasPermission/' + permission;
		    return  $http.get(url).then(this.successHandler, this.errorHandler);
    	},
    	getHttp : function() {
			return $http;
		}
    };
	
	var userService = angular.extend({}, BaseService);
	return angular.extend(userService, service);
});