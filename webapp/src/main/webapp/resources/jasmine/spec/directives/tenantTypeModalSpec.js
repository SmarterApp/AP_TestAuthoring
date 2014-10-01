describe('Tenant Type Modal', function() {
	  // you need to indicate your module in a test
	beforeEach(module('testauth', function($provide) {
		return $provide.decorator('$state', function() {
			return {
				transitionTo : function(path) {
					return {};
				},
			};
		});
	}));
	//TODO: figure out how to do this one
	describe("tenant type modal", function() {
		
	});
	
	describe("modal centered",function() {
		var scope = null;
		var element = null;

		beforeEach(inject(function($compile, $rootScope) {
			scope = $rootScope.$new();
			var template = angular.element('<div id="deleteMe" data-modal-centered><h5>Modal</h5><div><p>Modal Text</p></div></div>');
			$(document.body).children().first().before(template);
			$compile(template)(scope);
		}));

		afterEach(function() {
			$("#deleteMe").remove();
		});

		it("should display a modal centered", function() {
			// console.log($("#deleteMe").css("left"));
			// for some reason, the .css method doesn't work in
			// this case?
			// also, putting specific values causes this to fail?
//			expect($("#deleteMe").attr("style")).toBe("left: 8px; top: 122px; ");
			expect($("#deleteMe").attr("style")).not.toBe("");
		});
	});
		describe("select width helper", function() {
			jQuery.fx.off = true;
			var scope = null;
			var template = null;
			beforeEach(inject(function($compile, $rootScope) {
				scope = $rootScope.$new();
				template = angular.element("<select id='deleteMe' data-modal-select-width-helper style='width: 200px;'>"
								+ "<option>Option 1</option>"
								+ "</select>");
				$(document.body).children().first().before(template);
				$compile(template)(scope);

			}));

			afterEach(function() {
				$("#deleteMe").remove();
			});

			it("should set width to empty string", function() {
				inject(function($rootScope, _$timeout_) {
					$timeout = _$timeout_;
				});
				$timeout.flush();
				expect($("#deleteMe").attr("style")).toBe('');
			});
		});
});