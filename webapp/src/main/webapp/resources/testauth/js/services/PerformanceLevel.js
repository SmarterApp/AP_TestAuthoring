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
		}
    };
	return angular.extend(service, BaseService);
});
