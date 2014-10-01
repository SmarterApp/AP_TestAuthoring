testauth.factory("FileGroupService", function($http){
	var child = {
		getResource : function() {
			return 'fileGroup';
		},

		getHttp : function() {
			return $http;
		},
		
		getBaseUrl : function() {
			return baseUrl;
		},
		
		removeGridFile : function(gridFile){
	        return this.getHttp()({
	                method: 'DELETE',
	                url: this.getBaseUrl() + this.getResource() + '/gridFsFile/' + gridFile.gridFsId
	        }).then(this.successHandler, this.errorHandler);
	    },
	    
		getSimulationRecordByAssessmentId : function(id) {
			return this.getHttp().get(baseUrl + this.getResource() + '/simulationRecord/' + id + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		saveSimulationRecord : function(simulationRecord){
			if(simulationRecord.id){
				return this.updateSimulationRecord(simulationRecord);
			} else {
				return this.createSimulationRecord(simulationRecord);
			}
		},

		createSimulationRecord : function(simulationRecord) {
			var url = this.getBaseUrl() + this.getResource() + "/simulationRecord";
			return this.getHttp()({
					method: "POST",
					url: url,
					data: simulationRecord
					}).then(this.successHandler, this.errorHandler);
		},

		updateSimulationRecord : function(simulationRecord) {
			var url = this.getBaseUrl() + this.getResource() + '/simulationRecord/' + simulationRecord.id;
			return this.getHttp()({
					method: "PUT",
					url: url,
					data: simulationRecord
					}).then(this.successHandler, this.errorHandler);
		},
		
		getPsychometricRecordByPublishingRecordId : function(id) {
			return this.getHttp().get(baseUrl + this.getResource() + '/psychometricRecord/' + id + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		savePsychometricRecord : function(psychometricRecord, publishingRecord) {
			if(psychometricRecord.id && psychometricRecord.version == publishingRecord.version) {
				return this.updatePsychometricRecord(psychometricRecord);
			} else {
				return this.createPsychometricRecord(psychometricRecord);
			}
		},

		createPsychometricRecord : function(psychometricRecord) {
			var url = this.getBaseUrl() + this.getResource() + "/psychometricRecord";
			return this.getHttp()({
					method: "POST",
					url: url,
					data: psychometricRecord
					}).then(this.successHandler, this.errorHandler);
		},

		updatePsychometricRecord : function(psychometricRecord) {
			var url = this.getBaseUrl() + this.getResource() + '/psychometricRecord/' + psychometricRecord.id;
			return this.getHttp()({
					method: "PUT",
					url: url,
					data: psychometricRecord
					}).then(this.successHandler, this.errorHandler);
		},
		
		getPsychometricRecordVersions : function(assessmentId) {
			return this.getHttp().get(baseUrl + this.getResource() + '/psychometricRecordVersions/' + assessmentId + '?_=' + Math.random()).then(this.successHandler, this.errorHandler);
		},
		
		searchByPsychometricVersion : function(params) {
			var url = this.getBaseUrl() + this.getResource() + '/searchByPsychometricVersion?_=' + Math.random();
		    return  this.getHttp()({
	            method: 'GET',
	            url: url,
	            params: params
		    }).then(this.successHandler, this.errorHandler);
		}
		
    };
	var service = angular.extend({}, BaseService);
	return angular.extend(service, child); 
});
