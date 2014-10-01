testauth.factory("PublicationService", function($http){
	var child = {
		getResource : function() {
			return 'publication';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		getSubjectsAssignedToPublications : function(tenantId){
            var url = this.getBaseUrl() + this.getResource() + '/assignedSubjects/?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: {"tenantId":tenantId}
            }).then(this.successHandler, this.errorHandler);
        },
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
