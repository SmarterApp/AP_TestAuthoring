testauth.factory("SubjectService", function($http){
	var child = {
		getResource : function() {
			return 'subject';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
	    retireSubject: function(subjectId, undoRetirement) {
	        var url = this.getBaseUrl() + this.getResource() + '/' + subjectId + '/retire';
	        if (undoRetirement) {
	            url = url + '?undoRetirement=' + undoRetirement;
	        }
	        
            return this.getHttp()({ 
                method: "PUT",
                url: url,
                data: {} 
            }).then(this.successHandler, this.errorHandler);
        }
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
