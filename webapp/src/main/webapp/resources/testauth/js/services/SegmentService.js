testauth.factory("SegmentService", function($http){
	var child = {
		getResource : function() {
			return 'segment';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		}
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
