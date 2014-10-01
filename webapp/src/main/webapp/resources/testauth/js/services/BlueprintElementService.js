testauth.factory("BlueprintElementService", function($http){
	var service = {
		getResource : function() {
			return 'blueprintElement';
		},

		synchWithCoreStandards : function(blueprintId) {
            return this.getHttp()({ method: "PUT", url: this.getBaseUrl() + this.getResource() + '/' + blueprintId + '/synch', data: [] }).then(this.successHandler, this.errorHandler);
        },
        
        activateBpElementGrades : function(assessmentId,grades,active) {
            var queryParams = { "grades":grades, "active":active };
            return this.getHttp()({ method: "PUT", url: this.getBaseUrl() + this.getResource() + '/' + assessmentId + '/activate', params: queryParams, data: [] }).then(this.successHandler, this.errorHandler);
        },
        
        activateBpElementStandard : function(assessmentId,grade,standardKey,active) {
            var queryParams = { "grade":grade, "standardKey":standardKey, "active":active };
            return this.getHttp()({ method: "PUT", url: this.getBaseUrl() + this.getResource() + '/' + assessmentId + '/activateStandard', params: queryParams, data: [] }).then(this.successHandler, this.errorHandler);
        },
        
        addSegmentToBlueprintElementData: function(assessmentId,segmentId,segmentIdToClone) {
            var url = this.getBaseUrl() + this.getResource() + '/' + assessmentId + '/segment/' + segmentId + '/add';
            if (segmentIdToClone) {
                url = url + '?segmentIdToClone=' + segmentIdToClone;
            }
            return this.getHttp()({ 
                method: "PUT",
                url: url,
                data: [] 
            }).then(this.successHandler, this.errorHandler);
        },
        
        clearBlueprint: function(assessmentId,segmentId) {
            return this.getHttp()({ 
                method: "PUT",
                url: this.getBaseUrl() + this.getResource() + '/' + assessmentId + '/clear?segmentId=' + segmentId,
                data: [] 
            }).then(this.successHandler, this.errorHandler);
        },
        
		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		bpErrorHandler : function (response) {
	        var returnVal = {
	                data : {},
                    errors : []
	        };
           
            // key = blueprintElements[index].fieldName  *OR*
            // key = blueprintElements[index].blueprintElementValueMap[segment-id].fieldName"
            // messages = [ "error-msg1", "error-msg2" ]
	        returnVal.errors = $.map(response.data.messages, function(messages,errorKey) {
	            var messageArray = errorKey.split('.');
	            var bpData = {};
                bpData['blueprintIndex'] = messageArray[0].split(/[\[\]]/)[1]; // split on '[' and ']'
                bpData['segmentId'] = messageArray.length < 3 ? null : messageArray[1].split(/[\[\]]/)[1];  // split on '[' and ']'
                bpData['fieldName'] = messageArray.length < 3 ? messageArray[1] : messageArray[2];
                bpData['message'] = messages.join('\n');
                return bpData;
	        });
	        
	        return returnVal;
	    },
	    
	    searchBySegment : function(params){
	    	var url = this.getBaseUrl() + this.getResource() + '/' + params.segmentId + '/searchBySegment/?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
                params: params
            }).then(this.successHandler, this.errorHandler);
        },
	    
	    updateCollection : function(objectList){
            var params = { "blueprintElements":objectList };        
            return this.getHttp()({
                method: "PUT",
                url: baseUrl + 'blueprintElement',
                data: params
            }).then(this.successHandler, this.bpErrorHandler);
        },
		
		getValidationResults : function(assessmentId) {
			return this.getHttp().get(baseUrl + 'assessment/'+ assessmentId + '/validateblueprint?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		getElementTotalCounts : function(assessmentId){
	    	var url = this.getBaseUrl() + this.getResource() + '/getElementTotalCounts/' + assessmentId + '?_=' + Math.random();
            return this.getHttp()({
                method: "GET",
                url: url,
            }).then(this.successHandler, this.errorHandler);
        }
    };
	return angular.extend(service, BaseService);
});
