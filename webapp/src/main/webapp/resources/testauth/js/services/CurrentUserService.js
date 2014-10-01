
testauth.factory("CurrentUserService", function($http,$cookies){
	var service =   {
		getTenantId : function(){
			return $cookies.currentTenantId;
		},
		
		setTenantId : function(tenantId){
			$cookies.currentTenantId = tenantId;
		}
			
    };
	
	return service;
});