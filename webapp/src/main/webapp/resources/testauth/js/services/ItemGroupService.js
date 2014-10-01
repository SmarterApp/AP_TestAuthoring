testauth.factory("ItemGroupService", function($http){
	var child = {
		getResource : function() {
			return 'itemGroup';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		findByAssessmentId : function(assessmentId) {
	    	var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: { assessmentId: assessmentId }
            }).then(this.successHandler, this.errorHandler);
		}
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
