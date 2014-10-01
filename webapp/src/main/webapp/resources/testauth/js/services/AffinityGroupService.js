testauth.factory("AffinityGroupService", function($http){
	var child = {
		getResource : function() {
			return 'affinityGroup';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		searchAffinityGroups : function(params) {
	    	var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: params
            }).then(this.successHandler, this.errorHandler);
		},
		importItems : function(params) {
			var url = this.getBaseUrl() + this.getResource() + '/importItems?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: params
            }).then(this.successHandler, this.errorHandler);
		},
	    updateCollection : function(objectList){
            var params = { "affinityGroups":objectList };        
            return this.getHttp()({
                method: "PUT",
                url: baseUrl + this.getResource(),
                data: params
            }).then(this.successHandler, this.errorHandler);
        },
        
        findByAssessmentId : function(assessmentId) {
            var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: { assessmentId: assessmentId }
            }).then(this.successHandler, this.errorHandler);
        },
        
        attachItemsToAffinityGroup : function(affinityGroupId, itemIdentifiers) {
            var url = this.getBaseUrl() + this.getResource() + '/' + affinityGroupId + '/attachItems';
            return this.getHttp()({
                method: "PUT",
                url: url,
                data:  itemIdentifiers
            }).then(this.successHandler, this.errorHandler);
        },
        
        detachItemsFromAffinityGroup : function(affinityGroupId, itemIdentifiers) {
            var url = this.getBaseUrl() + this.getResource() + '/' + affinityGroupId + '/detachItems';
            return this.getHttp()({
                method: "PUT",
                url: url,
                data:  itemIdentifiers
            }).then(this.successHandler, this.errorHandler);
        },
        
        getValidationResults : function(assessmentId) {
            return this.getHttp().get(baseUrl + 'assessment/'+ assessmentId + '/validateaffinitygroups?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        },
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child);
});