testauth.directive('enter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
        	// Enter or Space
            if(event.which === 13 || event.which === 32) {
                scope.$apply(function (){
                    scope.$eval(attrs.enter);
                });

                event.preventDefault();
            }
        });
    };
});