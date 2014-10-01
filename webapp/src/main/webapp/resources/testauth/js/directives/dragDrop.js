
testauth.directive('dragDrop', function() {
	return {
		restrict: 'A',
        
        controller : function($scope, $attrs) {
			
            $scope.getSelectedRow = function(eventTarget) {
            	var selectedRow = eventTarget;
            	while(selectedRow.parentNode != null && selectedRow.attributes["draggable"] == null) {
            		selectedRow = selectedRow.parentNode;
            	}
            	return selectedRow; 
            };
        	
        	$scope.toggleDragged = function(index, event, sortedList) {
        		var selectedRow = $scope.getSelectedRow(event.target);
  				
	  			switch(event.keyCode) {
	  			
	  			case 32:  // Space
	  				if(selectedRow.getAttribute("aria-grabbed") == "true") {
	  	  				selectedRow.setAttribute("aria-grabbed", false);
	  	  				selectedRow.setAttribute("aria-droppeffect", "none");
	  	  				selectedRow.className = selectedRow.className.replace(/\ draggable\b/, "");
	  				} else {
	  	  				selectedRow.setAttribute("aria-grabbed", true);
	  	  				selectedRow.setAttribute("aria-droppeffect", "move");
	  	  				selectedRow.className += " draggable";
	  				}
	  				break;
	  				
	  			case 37 :  // Left arrow
				case 38 :  // Up arrow
					var previousSibling = selectedRow.previousElementSibling;
					if (previousSibling != null) {
						if(selectedRow.getAttribute("aria-grabbed") == "true") {
							previousSibling = selectedRow.previousElementSibling;
							if (previousSibling != null) {
								var selectedObject = sortedList[index];
								var previousObject = sortedList[index - 1];
								
								if(selectedObject != null && previousObject != null && index > 0) {
									sortedList[index] = previousObject;
									sortedList[index - 1] = selectedObject;
									$scope.sortChanged = true;
									index++;
								}
							}
						} else {
							previousSibling.focus();
						}
					}
					event.preventDefault();
					break;
				
				case 39 :  // Right arrow
				case 40 :  // Down arrow
					var nextSibling = selectedRow.nextElementSibling;
					if (nextSibling != null) {
						if(selectedRow.getAttribute("aria-grabbed") == "true") {
							nextSibling = selectedRow.nextElementSibling;
							if (nextSibling != null) {
								var selectedObject = sortedList[index];
								var nextObject = sortedList[index + 1];
								
								if(selectedObject != null && nextObject != null && index < sortedList.length) {
									sortedList[index] = nextObject;
									sortedList[index + 1] = selectedObject;
									$scope.sortChanged = true;
									index++;
								}
							}
						} else {
							nextSibling.focus();
						}
					}
					event.preventDefault();
					break;
	  				
	  			case 27:  // Escape
	  			case 9:  // Tab
	  				selectedRow.setAttribute("aria-grabbed", false);
	  				selectedRow.setAttribute("aria-droppeffect", "none");
	  				selectedRow.className = selectedRow.className.replace(/\ draggable\b/, "");
	  				break;
	  			}
        	};
        	
        	$scope.unfocusDragged = function(event) {
        		var selectedRow = $scope.getSelectedRow(event.target);
				selectedRow.setAttribute("aria-grabbed", false);
				selectedRow.setAttribute("aria-droppeffect", "none");
				selectedRow.className = selectedRow.className.replace(/\ draggable\b/, "");
        	};
		},
        
		link:function(scope, element, attrs){

		}
	}
})