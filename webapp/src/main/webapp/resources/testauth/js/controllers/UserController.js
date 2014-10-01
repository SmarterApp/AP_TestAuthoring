
testauth.controller('UserController', ['$scope', '$state', '$window', 'UserService' , 'CurrentUserService', 'AssessmentService',
     function UserController($scope, $state, $window, UserService, CurrentUserService, AssessmentService) {
		 var defaultAssets = {
				 logo : 'resources/testauth/images/logo_sbac.png',
				 headerbackground:'white'
		 };
	  	
		 $scope.tenantContainer = [];
		 $scope.selectedTenant = {};
		 
		 UserService.getApplicableTenants().then(function(response){
			 if(response.data != null){
				 $scope.tenantContainer = response.data.tenants;
				 if($scope.tenantContainer && $scope.tenantContainer.length > 0){
					 $scope.selectedTenant = {};
					 angular.forEach($scope.tenantContainer, function(value){
						 if(CurrentUserService.getTenantId() == value.id){
							 $scope.selectedTenant = value;
						 }
					 });
					 if(!$scope.selectedTenant.id){
						 $scope.selectedTenant = $scope.tenantContainer[0];
						 $scope.changeTenant();
					 }
				 }else{
					 $state.transitionTo("noTenant");
				 }
			 }
		 });
		 
		 UserService.hasPermission("ROLE_Setup Modify").then(function(response) {
			 $scope.showSettings = response.data;
		 });
		 
		 refreshAssets();
		 
		 function refreshAssets() {
			 UserService.getAssets(CurrentUserService.getTenantId()).then(function(response){
				 var assets = null;
				 if(response.data != null && response.data.assets != null){
					 assets = {};
					 angular.forEach(response.data.assets, function(value, key){
						 if(value.type == 'IMAGE'){
							 assets[value.name] = value.url;
						 }else{
							 assets[value.name] = value.property;
						 }
					 });
				 }
				 skinApp(assets);
			 });
		 }
		 
		 
		 $scope.changeTenant = function(){
			 CurrentUserService.setTenantId($scope.selectedTenant.id);
			 refreshAssets();
			 AssessmentService.removeCache();
			 if($state.current.name == 'home') {
				 $window.location.reload();
			 } else {
				 $state.transitionTo("home");
			 } 
		 };
		 
		 function skinApp(assets){
			 if(assets == null) {
				 assets = defaultAssets;
			 }
			 $scope.logoImage =  assets.logo;
			 $scope.headerbackground = {"background-color":assets.headerbackground }; 
		 }
}]);