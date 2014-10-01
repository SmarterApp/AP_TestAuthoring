
testauth.factory("ItemMetadataKeysService", function($http) {
	var service = {
		getResource : function() {
			return 'itemMetadataKeys';
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
		},

	    save : function(object) {
			// override with empty function
		},

		create : function(object) {
			// override with empty function
		},

		update : function(object, incrementNextMajor) {
			// override with empty function
		},

		remove : function(object) {
			// override with empty function
		}
    };
	return angular.extend(service, BaseService);
});
