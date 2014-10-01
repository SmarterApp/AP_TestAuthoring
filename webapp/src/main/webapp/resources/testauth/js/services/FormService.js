testauth.factory("FormService", function($http){
	var service = {
		getResource : function() {
			return 'form';
		},
		
		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		

		getLanguages : function() {
			return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/languages?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		}
    };
	return angular.extend(service, BaseService);
});
