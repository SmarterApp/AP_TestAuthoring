
testauth.factory("ReportingMeasureService", function($http) {
	var service = {
		getResource : function() {
			return 'reportingMeasure';
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
