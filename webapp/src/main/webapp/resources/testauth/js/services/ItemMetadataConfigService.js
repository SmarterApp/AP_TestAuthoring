
testauth.factory("ItemMetadataConfigService", function($http) {
	var service = {
		getResource : function() {
			return 'itemMetadataConfig';
		},
		
		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
	    
		findById : function(object) {
			// override with empty function
		},

		search : function(object) {
			// override with empty function
		},

		findByAssessmentId : function(id) {
			var url = this.getBaseUrl() + this.getResource() + '/assessmentId/' + id + '?_=' + Math.random();
			return  this.getHttp().get(url).then(this.successHandler, this.errorHandler);
		}
    };
	return angular.extend(service, BaseService);
});
