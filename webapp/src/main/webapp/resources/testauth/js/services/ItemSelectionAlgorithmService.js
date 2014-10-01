testauth.factory("ItemSelectionAlgorithmService", function($http) {
	var child = {
		getResource : function() {
			return 'itemSelectionAlgorithm';
		},

		getItemSelectionAlgorithmTypes : function() {
			return this.getHttp().get(baseUrl + this.getResource() + '/itemSelectionAlgorithmTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getItemSelectionPurposes : function() {
			return this.getHttp().get(baseUrl + this.getResource() + '/itemSelectionPurposes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getItemSelectionTypes : function() {
			return this.getHttp().get(baseUrl + this.getResource() + '/itemSelectionTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
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
});
