testauth.factory("CoreStandardsService", function($http){
	var child = {
		getResource : function() {
			return 'coreStandard';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		findById : function(object){
	    	// override with empty function
		},

		save : function(object){
	    	// override with empty function
		},
		
		create : function(object) {
			// override with empty function
		},
		
		update : function(object) {
			// override with empty function
		},
		
	    remove : function(object){
	    	// override with empty function
		},

		searchGradeByPublication : function(params){
			var url = this.getBaseUrl() + this.getResource() + '/publication/' + params.publicationKey + '/grade';
		    return  this.getHttp()({
	            method: 'GET',
	            url: url,
	            params: params
		    }).then(this.successHandler, this.errorHandler);
		},
		
		searchSocksByPublication : function(params) {
			var url = this.getBaseUrl() + this.getResource() + '/publication/' + params.publicationKey + '/sock';
		    return  this.getHttp()({
	            method: 'GET',
	            url: url,
	            params: params
		    }).then(this.successHandler, this.errorHandler);
		}
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child);
});
