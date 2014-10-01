testauth.factory("ItemService", function($http, $q){
	var child = {
		getResource : function() {
			return 'item';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		emptyPromise : function() { 
			var deferred = $q.defer();
		    setTimeout(function() {
		          deferred.resolve({
						data : {searchResults:[]},
						errors : [],
						messages:{}
					});
		    }, 1000);
		    return deferred.promise;
		},	

        findFirst20DistinctItemsByAssessmentIdAndSearchVal : function(assessmentId,searchVal) {
            var queryString = '?';
            queryString += (assessmentId ? '&assessmentId=' + assessmentId : '');
            queryString += (searchVal ? '&searchVal=' + searchVal : '');

            return $http({
                method: 'GET',
                url: this.getBaseUrl() + this.getResource() + '/search20' + queryString + '&_=' + Math.random()
            }).then(this.successHandler, this.errorHandler);
        },

		importItemsFromTib : function(params) {
			var url = this.getBaseUrl() + this.getResource() + '/importFromTib/?_=' + Math.random();
		    return  this.getHttp()({
	            method: 'GET',
	            url: url,
	            params: params
		    }).then(this.successHandler, this.errorHandler);
		},
		
	    updateCollection : function(objectList) {
            var params = { "items":objectList };
            var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
            return this.getHttp()({
                method: "PUT",
                url: url,
                data: params
            }).then(this.successHandler, this.errorHandler);
        },
		getSegmentItemCounts : function(segmentId) {
			var url = this.getBaseUrl() + this.getResource() + '/segmentItemCounts/' + segmentId + '?_=' + Math.random();
		    return  this.getHttp()({
	            method: 'GET',
	            url: url
		    }).then(this.successHandler, this.errorHandler);
		},
		updateSortInfo : function(formPartitionId, itemLocations) {
			var url = this.getBaseUrl() + 'formPartition/' + formPartitionId + '/sortItems?_=' + Math.random();
			return this.getHttp()({
                method: "PUT",
                url: url,
                data:  itemLocations
            }).then(this.successHandler, this.errorHandler);
		},
		moveInForm : function(assesmentId, data) {
			var url = this.getBaseUrl() + '/item/moveInForm?assessmentId='+assesmentId;
			return this.getHttp()({
                method: "PUT",
                url: url,
                data:  data
            }).then(this.successHandler, this.errorHandler);
		},
		moveInSegmentPool : function(assesmentId, data) {
			var url = this.getBaseUrl() + '/item/moveInSegmentPool?assessmentId='+assesmentId;
			return this.getHttp()({
                method: "PUT",
                url: url,
                data:  data
            }).then(this.successHandler, this.errorHandler);
		},
		removeFromForm : function(assesmentId, data) {
			var url = this.getBaseUrl() + '/item/removeFromForm?assessmentId='+assesmentId;
			return this.getHttp()({
                method: "PUT",
                url: url,
                data:  data
            }).then(this.successHandler, this.errorHandler);
		},
		removeFromSegmentPool : function(assesmentId, data) {
			var url = this.getBaseUrl() + '/item/removeFromSegmentPool?assessmentId='+assesmentId;
			return this.getHttp()({
                method: "PUT",
                url: url,
                data:  data
            }).then(this.successHandler, this.errorHandler);
		},
		
		updateCollection : function(objectList){
            var params = { "items": objectList };        
            return this.getHttp()({
                method: "PUT",
                url: baseUrl + 'item',
                data: params
            }).then(this.successHandler, this.bpErrorHandler);
        },
        
        getValidationResults : function(assessmentId) {
            return this.getHttp().get(baseUrl + 'assessment/'+ assessmentId + '/validateitempools?_=' + Math.random()).then(this.successHandler, this.errorHandler);
        }
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});;
