testauth.directive("menuSlider", function($document) {
	return {
		restrict:"A",
		transclude:false,	
		link:function(scope, element, attrs){
		    element.bind("click", function(){
		    	 if($(this).hasClass('show')){
		    		    $( ".slider-arrow, .secondary .navCore" ).animate({
		    	          left: "+=220"
		    			  }, 700, function() {
		    	            // Animation complete.
		    	          });
		    			  $(".secContent").animate({'margin-left': "240px"}, 700, function(){});
		    			  $(".left_menu_hidden").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".left_menu_visible").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".left_menu_visible_tib_search").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".left_menu_visible_segment").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".left_menu_errors").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".submenuslideText").animate({'margin-left': "0"}, 700, function(){});
		    			  $(".submenuslide").animate({'margin-left': "0"}, 700, function(){});
		    			  $(this).html('&laquo;').removeClass('show').addClass('hide');
		    			  scope.menuHidden = false;
		    	        }
		    	        else {   	
		    		    $( ".slider-arrow, .secondary .navCore" ).animate({
		    	          left: "-=220"
		    			  }, 700, function() {
		    	            // Animation complete.
		    	          });
		    			  $(".secContent").animate({'margin-left': "0px"}, 700, function(){});
		    			  $(".left_menu_hidden").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(".left_menu_visible").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(".left_menu_visible_tib_search").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(".left_menu_visible_segment").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(".left_menu_errors").animate({'margin-left': "-221px"}, 700, function(){});	
		    			  $(".submenuslideText").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(".submenuslide").animate({'margin-left': "-221px"}, 700, function(){});
		    			  $(this).html('&raquo;').removeClass('hide').addClass('show');   
		    			  scope.menuHidden = true;
		    	        }
		    });
		}
	};
});
 
testauth.directive('blueprintScroll', function($window) {
	  return {
		restrict:"A",
		transclude:false,			  
	    link: function(scope, element, attrs) {
	    	$(".blueprintScrollDiv").scroll(function(){
	    	    $(".blueprintDataDiv")
	    	        .scrollLeft($(".blueprintScrollDiv").scrollLeft());
	    	});
	    	$(".blueprintDataDiv").scroll(function(){
	    	    $(".blueprintScrollDiv")
	    	        .scrollLeft($(".blueprintDataDiv").scrollLeft());
	    	});	 
	    }
	  };
});

testauth.directive('titleText', function($window) {
	  return {
		restrict:"A",
		transclude:false,			  
	    link: function(scope, element, attrs) {
	    	$(".icon_preview2").each(function(){
	    	    $(this).parent().attr("title", "View");
	    	});
	    	$(".icon_copy2").each(function(){
	    	    $(this).parent().attr("title", "Copy");
	    	});	    	
	    	$(".icon_delete2").each(function(){
	    	    $(this).parent().attr("title", "Delete");
	    	});	    	
	    	$(".icon_saveAdd2").each(function(){
	    	    $(this).parent().attr("title", "Add");
	    	});
	    	$(".icon_update2").each(function(){
	    	    $(this).parent().attr("title", "Sort");
	    	});	 
	    	$(".icon-up").each(function(){
	    	    $(this).parent().attr("title", "Move up");
	    	});	 
	    	$(".icon-down").each(function(){
	    	    $(this).parent().attr("title", "Move down");
	    	});	 
	    	$(".icon_download2").each(function(){
	    	    $(this).parent().attr("title", "Download");
	    	});	 	    		    	
	    	
	    }
	  };
});