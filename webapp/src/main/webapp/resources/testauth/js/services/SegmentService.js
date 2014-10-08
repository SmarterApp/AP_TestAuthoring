testauth.factory("SegmentService", function($http){
	var child = {
		getResource : function() {
			return 'segment';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
	    updateCollection : function(objectList) {
            return this.getHttp()({ method: "PUT", url: this.getBaseUrl() + this.getResource(), data: objectList }).then(this.successHandler, this.errorHandler);
        }
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});
