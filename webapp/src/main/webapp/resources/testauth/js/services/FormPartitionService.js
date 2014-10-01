testauth.factory("FormPartitionService", function($http){
	var service = {
		getResource : function() {
			return 'formPartition';
		},
		
		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		getValidationResults : function(assessmentId) {
            return this.getHttp().get(baseUrl + 'assessment/'+ assessmentId + '/validateforms?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        },

    };
	return angular.extend(service, BaseService);
});
