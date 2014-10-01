testauth.factory("VersionService", function($http){
	var service = {
		getResource : function() {
			return 'version';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		getBuildInfo : function(){
	        var url = this.getBaseUrl() + this.getResource() + '?_=' + Math.random();
	        return  this.getHttp().get(url).then(this.successHandler, this.errorHandler);
	    }
    };
	return angular.extend(service, BaseService);
});
