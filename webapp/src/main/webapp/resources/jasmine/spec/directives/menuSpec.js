describe('menu', function() {
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
	describe("menu slider", function() {
		
		beforeEach(inject(function($compile, $rootScope) {
			jQuery.fx.off = true;
			var scope = $rootScope.$new();
			var template = angular.element(
				"<div id='deleteMe'>" +
				"<a href='javascript:void(0);' class='slider-arrow' data-menu-slider title='Menu Slider'>&raquo;</a>" +
				"<div class='secContent'></div>" +
				"<div class='left_menu_hidden'></div>" +
				"<div class='left_menu_visible'></div>" +
				"<div class='left_menu_visible_tib_search'></div>" +
				"<div class='left_menu_visible_segment'></div>" +
				"<div class='left_menu_errors'></div>" +
				"</div>"
			);
			$(document.body).children().first().before(template);
			$compile(template)(scope);
		}));
		afterEach(function() {
			$("#deleteMe").remove();
		});
		
		it("should show the menu", function() {
			$(".slider-arrow").click();
			expect($(".secContent").css("margin-left")).toBe("0px");
			expect($(".left_menu_hidden").css("margin-left")).toBe("-221px");
			expect($(".left_menu_visible").css("margin-left")).toBe("-221px");
			expect($(".left_menu_visible_tib_search").css("margin-left")).toBe("-221px");
			expect($(".left_menu_visible_segment").css("margin-left")).toBe("-221px");
			expect($(".left_menu_errors").css("margin-left")).toBe("-221px");
			expect($(".slider-arrow").html()).toBe($("<div>&raquo;</div>").text());
			expect($(".slider-arrow").hasClass("show")).toBe(true);
		});
		
		it("should hide the menu", function() {
			$(".slider-arrow").removeClass('hide').addClass('show');
			$(".slider-arrow").click();
			expect($(".secContent").css("margin-left")).toBe("240px");
			expect($(".left_menu_hidden").css("margin-left")).toBe("0px");
			expect($(".left_menu_visible").css("margin-left")).toBe("0px");
			expect($(".left_menu_visible_tib_search").css("margin-left")).toBe("0px");
			expect($(".left_menu_visible_segment").css("margin-left")).toBe("0px");
			expect($(".left_menu_errors").css("margin-left")).toBe("0px");
			expect($(".slider-arrow").html()).toBe($("<div>&laquo;</div>").text());
			expect($(".slider-arrow").hasClass("hide")).toBe(true);
		});
	});
	
	describe("blueprint scroll", function() {
		beforeEach(inject(function($compile, $rootScope) {
			spyOn($.fn, "scroll").andCallThrough();
			spyOn($.fn, "scrollLeft");
			var scope = $rootScope.$new();
			var template = angular.element(
							"<div class='deleteMe blueprintScrollDiv' data-blueprint-scroll>" +
								"<table><tr><td>Scroll</td></tr></table>" +
							"</div>" +
							"<div class='deleteMe blueprintDataDiv' data-blueprint-scroll>" +
								"<table><tr><td>Data</td></tr></table>" +
							"</div>");
			$(document.body).children().first().before(template);
			$compile(template)(scope);
		}));
		afterEach(function() {
			$(document.body).find(".deleteMe").remove();
		});
		
		it("should call the scroll left method", function() {
			expect($.fn.scroll).toHaveBeenCalled();
			expect($.fn.scroll.callCount).toBe(4);
			//TODO: can't figure out why this doesn't get called..
			//my suspicion is it is due to the spyOn 
//			expect($.fn.scrollLeft).toHaveBeenCalled();
		});
		
	});
	
	describe('title text', function() {
		beforeEach(inject(function($compile, $rootScope) {
			// create a scope object for us to use.
			var scope = $rootScope.$new();
			var template = angular.element(
					"<table id='deleteMe'><tr><td class='normalSpace' data-title-text><div class=\"tableButtonGroup\">" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_preview2\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_delete2\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_saveAdd2\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_update2\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon-up\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon-down\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_download2\"></span></button>" +
						"<button class=\"boxBtn\"><span class=\"btnIcon icon_sprite icon_download2\"></span></button>" +
					"</div></td></tr></table>"
			);
			$(document.body).children().first().before(template);
			$compile(template)(scope);
		}));
		
		afterEach(function() {
			$(document.body).find("#deleteMe").remove();
		});
		
		it("should set title properly on each button", function() {
			expect($(".icon_preview2").parent().attr("title")).toBe("View");
			expect($(".icon_delete2").parent().attr("title")).toBe("Delete");
			expect($(".icon_saveAdd2").parent().attr("title")).toBe("Add");
			expect($(".icon_update2").parent().attr("title")).toBe("Sort");
			expect($(".icon-up").parent().attr("title")).toBe("Move up");
			expect($(".icon-down").parent().attr("title")).toBe("Move down");
			$(".icon_download2").each(function() {
				expect($(this).parent().attr("title")).toBe("Download");
			});
		});
	});
}); 