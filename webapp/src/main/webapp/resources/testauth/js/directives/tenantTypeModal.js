testauth.directive("tenantTypeModal", function($modal,ProgmanService) {
	return {
		restrict:"A",
		transclude:false,
		scope:{
            selectedTenantType : '='
		},
		controller: function($scope) {
		    var ModalInstanceCtrl = function ($scope, $modalInstance, currentSelection) {		        
		        $scope.tenantType = currentSelection;
		        
		        ProgmanService.loadAllTenantTypes().then(function(loadedData) {
                    $scope.tenantTypes = loadedData.data;
                });
		        		        		        
		        $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                
                $scope.select = function(tenantType) {
                    $modalInstance.close(tenantType);
                };
		    };
	          
		    $scope.open = function() {
                var modalInstance = $modal.open({
                  templateUrl: 'resources/testauth/partials/tenant-type-modal.html',
                  controller: ModalInstanceCtrl,
                  resolve: {
                      currentSelection: function() {
                          return $scope.selectedTenantType;
                      }
                  }
                });

                modalInstance.result.then(function (tenantType) {
                    $scope.selectedTenantType = tenantType;
                });
		    };
		},
		link:function(scope, element, attrs){
		    element.bind("click", function(){
		        scope.$apply( scope.open() );
		    });
		}
	};
});

testauth.directive("modalCentered", function($window){
    return {
        restrict:"A",
        transclude:false,
        link : function(scope, element, attrs) {
            var windowElement = angular.element($window);
            
            var windowWidth = windowElement.innerWidth();
            var windowHeight = windowElement.innerHeight();
            var elementWidth = $(element).outerWidth();
            var elementHeight = $(element).outerHeight();
            
            var left = (windowWidth - elementWidth) / 2;
            var top = (windowHeight - elementHeight) / 2;
            
            $(element).css("left",left + "px"); 
            $(element).css("top",top + "px"); 
        }
    };
});

// Force IE9 to redraw <select> elements loaded through ajax.  See below:
// http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option
testauth.directive("modalSelectWidthHelper", function($timeout){
    return {
        restrict:"A",
        transclude:false,
        link : function(scope, element, attrs) {
            $timeout( function() {
                element.css('width', 0).css('width', '');
            });
        }
    };
});
