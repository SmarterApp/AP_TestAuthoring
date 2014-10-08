testauth.factory("PerformanceLevelService", function($http) {
	var service = {
		getResource : function() {
			return 'performanceLevel';
		},
		
		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		getBlueprintReferences : function(params) {
			params['_'] = Math.random();
			var url = baseUrl + '/performanceLevel/blueprintReferences/';
            return $http.get(url,  {params:params}).then(this.successHandler, this.errorHandler);
		}
    };
	return angular.extend(service, BaseService);
});
