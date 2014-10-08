testauth.directive('widgetNavigation', function() {
	return {
		restrict: 'A',
		scope: true,
		
		controller: function($scope, $attrs) {
			$scope.focusElement = function(elementId) {
				var foundElement = document.getElementById(elementId);
				document.getElementById(elementId).focus();
			};
		},
        
		link:function(scope, element) {
			
			scope.processPreviousSibling = function(previousSibling) {
				if(previousSibling && previousSibling.getAttribute("class") != null) {
					var hidden = previousSibling.getAttribute("class").indexOf("ng-hide") > -1;
					
					if(hidden) {
						scope.processPreviousSibling(previousSibling.previousElementSibling);
					} else {
						event.target.setAttribute("tabindex", -1);
						previousSibling.setAttribute("tabindex", 0);
						previousSibling.focus();
					}
				}
			};
			
			scope.processNextSibling = function(nextSibling) {
				if(nextSibling && nextSibling.getAttribute("class") != null) {
					var hidden = nextSibling.getAttribute("class").indexOf("ng-hide") > -1;
					
					if(hidden) {
						scope.processNextSibling(nextSibling.nextElementSibling);
					} else {
						event.target.setAttribute("tabindex", -1);
						nextSibling.setAttribute("tabindex", 0);
						nextSibling.focus();
					}
				}
			};
			
			element.bind('keydown', function(event) {
  				
	  			switch(event.keyCode) {
	  			
	  			case 13:  // Enter
	  			case 32:  // Space
	  				event.target.click();
	  				event.preventDefault();
	  				break;
	  				
	  			case 37 :  // Left arrow
				case 38 :  // Up arrow
					scope.processPreviousSibling(event.target.previousElementSibling);
					event.preventDefault();
					break;
				
				case 39 :  // Right arrow
				case 40 :  // Down arrow
					scope.processNextSibling(event.target.nextElementSibling);
					event.preventDefault();
					break;
	  			}
        	});
		}
	}
})