testauth.factory("AssessmentService", function($http, $cacheFactory){
	var cache = $cacheFactory('AssessmentService');
	var child = {
		getResource : function() {
			return 'assessment';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		getAssessmentTypes : function(){
			return this.getHttp().get(this.getBaseUrl() + this.getResource() + '/type?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		getAffinityGroupItemCounts : function(assessmentId) {
            var url = this.getBaseUrl() + this.getResource() + '/' + assessmentId + '/affinityGroupItemCounts' + '?_=' + Math.random();
            return  this.getHttp()({
                method: 'GET',
                url: url
            }).then(this.successHandler, this.errorHandler);
        },
		
		copy : function(assessmentId) {
			var url = this.getBaseUrl() + this.getResource() + '/' + assessmentId;
			return this.getHttp()({ method: "POST", url: url, data: null }).then(this.successHandler, this.errorHandler);
		},
		
		getCache : function () {
			return cache.get("assessment");
		},
		
		removeCache : function () {
			return cache.removeAll();
		},
		
		updateCache : function (assessment) {
			return cache.put("assessment", assessment);
		},
		
		refreshCache : function () {
			assessment = findById(getCache().id);
			removeCache();
			return updateCache(assessment);
		}
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child);
});