testauth.filter('groupItemParams', function () {
	return function (params, filterName) {
	    var filtered = [];
	    
	    if(params.length > 0) {
		    var prevParam = "firstParam";
	
		    angular.forEach(params, function(param, index) {
		    	
		        if(param[filterName] != null && prevParam[filterName] !== param[filterName]) {
		        	param["newHeader"] = true;
		        } else {
		        	param["newHeader"] = false;
		        }
			        
		    	if(index + 1 < params.length) {
		    		var nextParam = params[index + 1];
	
		    		if(nextParam[filterName] == null) {
			        	param["andIndex"] = false;
			        	param["orIndex"] = false;
		    		} else if(nextParam[filterName] !== param[filterName]) {
			        	param["andIndex"] = true;
			        	param["orIndex"] = false;
			        } else {
			        	param["orIndex"] = true;
			        	param["andIndex"] = false;
			        }
		    	}
		        filtered.push(param);
		        prevParam = param;
		    });
	    }
	    return filtered;
	};
});