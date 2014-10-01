testauth.factory("PublishingRecordService", function($http){
	var child = {
		getResource : function() {
			return 'publishingRecord';
		},

		getHttp : function() {
			return $http;
		},

		getBaseUrl : function() {
			return baseUrl;
		},

	    save : function(object) {
			// override with empty function
		},

		create : function(object) {
			// override with empty function
		},

		update : function(object, incrementNextMajor) {
			var url = this.getBaseUrl() + this.getResource() + '/' + object.id + (incrementNextMajor == true ? '?incrementNextMajor=true' : '');
			return this.getHttp()({ method: "PUT", url: url, data: object }).then(this.successHandler, this.errorHandler);
		},

	    remove : function(object){
	    	// override with empty function
		},

		retrieveLatestStatus : function(assessmentId) {
			return this.getHttp().get(baseUrl + this.getResource() + '/current/' + assessmentId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		getPublishingStatuses : function() {
			return this.getHttp().get(baseUrl + this.getResource() + '/publishingStatusTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		checkPublishingValidity : function(assessmentId) {
			return this.getHttp().get(baseUrl + this.getResource() + '/checkPublishingValidity/' + assessmentId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		}
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child);
});