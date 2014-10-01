testauth.factory("ApprovalService", function($http){
	var child = {
		getResource : function() {
			return 'approval';
		},

		getHttp : function() {
			return $http;
		},

		getBaseUrl : function() {
			return baseUrl;
		},

	    save : function(object){
			// override with empty function
		},

		create : function(object) {
			// override with empty function
		},

	    remove : function(object){
	    	// override with empty function
		},
		
		retrieveLatestApprovals : function(publishingRecordId) {
			return this.getHttp().get(baseUrl + this.getResource() + '/current/' + publishingRecordId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		isAdminUser : function() {
			return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/isAdminUser?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		}

    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child);
});