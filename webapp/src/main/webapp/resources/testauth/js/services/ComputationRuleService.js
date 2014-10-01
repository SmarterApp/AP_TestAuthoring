
testauth.factory("ComputationRuleService", function($http) {
	var child = {
		getResource : function() {
			return 'computationRule';
		},

		getConversionTableTypes : function(){
			return this.getHttp().get(baseUrl + this.getResource() + '/conversionTableTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getComputationRuleTypes : function(){
			return this.getHttp().get(baseUrl + this.getResource() + '/computationRuleTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getComputationRuleMultiplicityTypes : function(){
			return this.getHttp().get(baseUrl + this.getResource() + '/computationRuleMultiplicityTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getDictionaryIndexTypes : function(){
			return this.getHttp().get(baseUrl + this.getResource() + '/dictionaryIndexTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
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
