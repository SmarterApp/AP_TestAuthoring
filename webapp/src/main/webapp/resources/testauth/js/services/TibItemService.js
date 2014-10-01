testauth.factory("TibItemService", function($http){
	var child = {
		getResource : function() {
			return 'tibitem';
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
		
		searchItems : function(params){
            var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
            return  this.getHttp()({
                method: 'GET',
                url: url,
                params: params
            }).then(this.successHandler, this.errorHandler);
        },
        
        getItemMetadata : function(tenantId){
            var url = this.getBaseUrl() + "tibitemMetadata?_=" + Math.random();
            return  this.getHttp()({
                method: 'GET',
                url: url,
                params: {"tenantId":tenantId}
            }).then(this.successHandler, this.errorHandler);
        },
        
        getItemMetadataValues : function(params){
            var url = this.getBaseUrl() + "tibitemMetadata/values?_=" + Math.random();
            return  this.getHttp()({
                method: 'GET',
                url: url,
                params: params
            }).then(this.successHandler, this.errorHandler);
        }
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
