
testauth.factory("ScoringRuleService", function($http) {
	var child = {
		getHttp : function() {
			return $http;
		},

		getBaseUrl : function() {
			return baseUrl;
		},

		getResource : function() {
			return 'scoringRule';
		},

		getBlueprintReferenceTypes : function() {
			return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/blueprintReferenceTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},

		getBlueprintDenotationTypes : function() {
			return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/blueprintDenotationTypes?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
        findDistinctActiveLevelsForAssessment : function(assessmentId) {
            return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/activeBlueprintLevels/' + assessmentId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        },
		
        findBlueprintElementsNotCovered : function(assessmentId) {
            return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/blueprintElementsNotCovered/' + assessmentId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        },

	    updateCollection : function(objectList) {
            return this.getHttp()({ method: "PUT", url: this.getBaseUrl() + this.getResource(), data: objectList }).then(this.successHandler, this.errorHandler);
        },
    	
    	removeConversionTableFile : function(id) {
            return this.getHttp()({ method: 'DELETE', url: this.getBaseUrl() + this.getResource() + '/conversionTableFile/' + id }).then(this.successHandler, this.errorHandler);
        },
    	
    	findConversionTableFileById : function(id) {
    		return  this.getHttp().get(this.getBaseUrl() + this.getResource() + '/conversionTableFile/' + id + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
    	},
		
		getBlueprintReferences : function(params) {
			params['_'] = Math.random();
			var url = this.getBaseUrl() + this.getResource() + '/blueprintReferences/';
            return $http.get(url,  {params:params}).then(this.successHandler, this.errorHandler);
		}
    };

	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});
