testauth.filter("assessmentVersionFilter", function(){
    return function(assessmentId, versions){
    	var version = "";
    	angular.forEach(versions, function(publishingRecord){
    		  if (assessmentId == publishingRecord.assessmentId) {
    			  version = publishingRecord.version;
    			  return;
    		  }
    	});
        return version;
    };
});

testauth.filter("convertToIntFilter", function(){
    return function(text){
        return parseInt(text);
    };
});