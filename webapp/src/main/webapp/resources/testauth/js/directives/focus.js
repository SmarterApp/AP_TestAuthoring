testauth.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if(name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

testauth.factory('focus', function ($rootScope, $timeout) {
    return function(name) {
        $timeout(function (){
            $rootScope.$broadcast('focusOn', name);
        });
    };
});


testauth.directive('focusWatch', function($timeout, $parse) {
	return {
	    link: function(scope, element, attrs) {
	        var model = $parse(attrs.focusWatch);
	        scope.$watch(model, function(value) {
	        	if(value === true) { 
	        		$timeout(function() {
	        			element[0].focus(); 
	        		});
	        	}
	        });
	    }
	}
});