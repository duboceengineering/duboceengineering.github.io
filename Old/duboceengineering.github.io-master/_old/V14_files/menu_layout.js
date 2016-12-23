var menu_layout = {};
menu_layout.LEFT_MENU_WIDTH = 270;
menu_layout.SCROLLBAR_WIDTH = 0;

menu_layout.init = function(container,items){
	var currentPageId = $(".master.container").attr("id");
	var currentPageSlug = $(".master.container").attr("data-itemslug");
	if (XPRSHelper.isChrome()){
		menu_layout.SCROLLBAR_WIDTH = 0;
		//$(".master.container").addClass("chrome");
	}
	items.each(function(){
		var currentItem = $(this);
		
		//Mark link of the current page
		currentItem.find(".preview-item-links a").each(function(){
			var linkStr = $(this).attr("href");
			if (linkStr){
				//remove query params
				if (linkStr.indexOf("?") != -1){
					linkStr = linkStr.substring(0,linkStr.indexOf("?"));
				}
				//match slug or vbid
				var linkToCurrentPage = linkStr.indexOf(currentPageId, linkStr.length - currentPageId.length) !== -1;
				linkToCurrentPage = linkToCurrentPage || linkStr.indexOf(currentPageSlug, linkStr.length - currentPageSlug.length) !== -1;
				if (linkToCurrentPage){
					$(this).addClass("current-page");
					//do not mark more than one even if found
					return false;
				}
			}
		});



		
		//LEFT MENU
		var holder = container.closest(".master.item-box");
		holder.addClass("animated-color")
		var settings = holder.find(".layout-settings");
		var menuPosition = settings.attr("data-menu_position");
		var isProductPage = window.location.href.indexOf("/product/") != -1;
		if(typeof window["EditorHelper"] == "undefined"){
			var submenuTitles = currentItem.find(".submenu-title");
			submenuTitles.each(function(){
				var submenuTitle = $(this);
				if (submenuTitle.parent().is("a")){
					submenuTitle.unwrap()
				}
				submenuTitle.unbind("click").bind("click",function(e){
					e.stopPropagation();
					var clickedTitle = $(this);
					menu_layout.toggleSubmenu(clickedTitle);
				});
			});
			// submenuTitles.unbind("click").bind("click",function(e){
			// 	e.stopPropagation();
			// 	var clickedTitle = $(this);
			// 	menu_layout.toggleSubmenu(clickedTitle);
			// });
		}

		if (isProductPage && menuPosition == "none"){
			menuPosition= "top";
			settings.attr("data-menu_position","top")
		}
		holder.removeClass("hidden-menu");
		if (menuPosition == "none"){
			holder.css("display","none");
		}else if (menuPosition == "left"){
			$(".master.container").find("#children").first().css("width",$(window).innerWidth() - menu_layout.SCROLLBAR_WIDTH - menu_layout.LEFT_MENU_WIDTH);
			$(".left-menu-placeholder").height($(window).height());
		}else{
			$(".master.container").find("#children").first().css("width","");
		}
		
		var previewTitle = currentItem.find(".preview-title");
		//var previewSubtitle = currentItem.find(".preview-subtitle");
		var rightSideDiv = currentItem.find('.right-div');
		var leftSideDiv = currentItem.find('.left-div');
		var stripe = container.closest(".master.item-box");
		totalLinksWidth = rightSideDiv.outerWidth(true);
		
		//Saving the original links width for unmenufying - only if we are not centered
		if (!rightSideDiv.hasClass("centerified") && settings.attr("data-menu_align") != "center" && stripe.css("display") != "none"){
			stripe.attr("data-original-menu-width",totalLinksWidth);
		}
		
		//no shrink if title is not present
		var originalFontSize = "N/A";
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length == 0){
			originalFontSize = Math.round(parseInt(previewTitle.css("font-size")));
			leftSideDiv.attr("data-orig-font-size",originalFontSize);
		}
		
		//If no subtitle and no title found link will be aligned to center
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length > 0 && currentItem.find(".element-placeholder[data-elementtype='SUBTITLE']").length > 0){
			currentItem.find(".helper-div").hide();
			if (currentItem.find(".element-placeholder[data-elementtype='ICON']").length > 0){
				menu_layout.centerifyLinks(leftSideDiv,rightSideDiv);
			}else{
				menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
			}
		}else{
			currentItem.find(".helper-div").show();
			menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
		}
	});
};


menu_layout.closeOpenedSubmenus = function(){
	var openedSubmenus = $(".submenu-title.menu-opened");
	var wasOpen = openedSubmenus.length > 0;
	openedSubmenus.each(function(){
		var currentSubmenuTitle = $(this);
		if (currentSubmenuTitle.parent().is("a")){
			currentSubmenuTitle.parent().next(".submenu").hide();
		}else{
			currentSubmenuTitle.next(".submenu").hide();
		}
		currentSubmenuTitle.removeClass("menu-opened");
	});
	return wasOpen;
};

menu_layout.toggleSubmenu = function(clickedTitle){
	var holder = clickedTitle.closest(".master.item-box");
	var settings = holder.find(".layout-settings");
	var menuPosition = settings.attr("data-menu_position");
	var currentSubmenu = clickedTitle.next(".submenu");
	if (clickedTitle.parent().is("a")){
		currentSubmenu = clickedTitle.parent().next(".submenu");
	}
	var noPlaceMode = holder.find(".preview-item-links.no-place").length == 1;
	var minifiyType = settings.attr("data-always_minified");
	if (currentSubmenu.is(":visible")){
		if (menuPosition == "left" || minifiyType == "side_screen" || minifiyType == "full_screen" || noPlaceMode){
			currentSubmenu.slideUp(function(){
				clickedTitle.removeClass("menu-opened");
			});
		}else{
			currentSubmenu.fadeOut(function(){
				clickedTitle.removeClass("menu-opened");
			});
		}
		
	}else{
		menu_layout.calculateSubmenuBG(holder,currentSubmenu);
		holder.find(".menu-opened").removeClass("menu-opened");
		clickedTitle.addClass("menu-opened");
		if (menuPosition == "left" || minifiyType == "side_screen" || minifiyType == "full_screen" || noPlaceMode){
			holder.find(".submenu:visible").slideUp()
			currentSubmenu.slideDown();
		}else{
			holder.find(".submenu:visible").fadeOut()
			currentSubmenu.fadeIn(function(){
				clickedTitle.addClass("menu-opened");
			});
		}
		
	}
};

menu_layout.centerifyLinks = function(leftSideDiv,rightSideDiv){
	leftSideDiv.css({"width":0,"display":"inline"});
	rightSideDiv.css({"width":"100%","text-align":"center"}).addClass("centerified");
};

menu_layout.uncenterifyLinks = function(leftSideDiv,rightSideDiv){
	leftSideDiv.css({"width":"","display":""});
	rightSideDiv.css({"width":"","text-align":""}).removeClass("centerified");;
};

menu_layout.applyLayout = function(container,items,paramsFromRealTime){
	var holder = container.closest(".master.item-box");
	var masterContainer = $(".master.container");
	items.each(function(){
		var currentItem = $(this);
		currentItem.find(".preview-item-links").css("display","");
		var settings = container.closest(".master.item-box").find(".layout-settings");
		
		var alwaysMinify = settings.attr("data-always_minified") != "false";
		var leftMenuPlaceHolder = masterContainer.find(".left-menu-placeholder");
		var menuAlign = settings.attr("data-menu_align");
		if(holder.find(".item-wrapper").innerWidth() < 400 && leftMenuPlaceHolder.length == 0 && holder.css("display") != "none"){
			menuAlign = "left";
			holder.addClass("force-min-height50 minimal-design");
		}else{
			if (!holder.is(".being-scrolled")){
				holder.removeClass("force-min-height50 minimal-design");
			}
		}
		var menuPosition = settings.attr("data-menu_position");
		
		
		if (menuPosition == "none"){
			holder.css("display","none");
			//return;
		}else if (menuPosition == "left"){
			holder.css("display","");
			holder.removeClass("minimal-design");
			masterContainer.find("#children").first().css("width",$(window).innerWidth() - menu_layout.SCROLLBAR_WIDTH - menu_layout.LEFT_MENU_WIDTH);
			$(".left-menu-placeholder").height($(window).height());
		}else{
			holder.css("display","");
			masterContainer.find("#children").first().css("width","");
			//holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
			if (holder.find('.preview-icon-holder').length > 0){
				holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
			}else{
				holder.find('.right-div').css("height","");
			}
		}
		
		
		var menuRatio = $(window).width()/menu_layout.LEFT_MENU_WIDTH;
		if (menuPosition == "left" && menuRatio > 4){
			menuAlign = "center";
			masterContainer.addClass("left-menu-layout");
			holder.find(".preview-content-holder").css("height",$(window).height());
			if (leftMenuPlaceHolder.length == 0){
				leftMenuPlaceHolder = $("<div />").addClass("left-menu-placeholder");
				var holderHandle = holder.next(".control-handle");
				leftMenuPlaceHolder.append(holder);
				if (holderHandle.length > 0){
					leftMenuPlaceHolder.append(holderHandle);
				}
				$(".master.container > #children").before(leftMenuPlaceHolder);
			} 
		}else{
			masterContainer.removeClass("left-menu-layout");
			holder.find(".preview-content-holder").css("height","");
			masterContainer.find("#children").first().css("width","");
			menuPosition="top";
			if (leftMenuPlaceHolder.length != 0){
				var holderHandle = holder.next(".control-handle");
				$(".master.container > #children").prepend(holder);
				if (holderHandle.length > 0){
					holder.after(holderHandle);
				}
				
				leftMenuPlaceHolder.remove();
			}
		}
		if (menuAlign == "center"){
			holder.addClass("center-aligned-menu");
		}else{
			holder.removeClass("center-aligned-menu");
		}
		var previewTitle = currentItem.find(".preview-title");
		var previewSubtitle = currentItem.find(".preview-subtitle");
		var rightSideDiv = currentItem.find('.right-div');
		var leftSideDiv = currentItem.find('.left-div');
		leftSideDiv.find(".helper-div").show();
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length > 0 && currentItem.find(".element-placeholder[data-elementtype='SUBTITLE']").length > 0){
			currentItem.find(".helper-div").hide();
			if (currentItem.find(".element-placeholder[data-elementtype='ICON']").length > 0){
				menu_layout.centerifyLinks(leftSideDiv,rightSideDiv);
			}else{
				menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
			}
		}else{
			currentItem.find(".helper-div").show();
			menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
		}
		
		var stripe = container.closest(".master.item-box");
		
		var textElement = currentItem.find(".preview-title");
		var contentHolder = currentItem.find(".preview-content-holder");
		var contentWrapper = currentItem.find(".preview-content-wrapper");
		
		var originalFontSize = "N/A";
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length == 0){
			originalFontSize =  parseInt(leftSideDiv.attr("data-orig-font-size"));
			if (textElement.attr("data-orig-font-size")){
				if (originalFontSize != textElement.attr("data-orig-font-size")){
					originalFontSize = textElement.attr("data-orig-font-size");
				}
			}
			textElement.css("font-size",originalFontSize + "px");
		}
		
		var totalLinksWidth = 0;
		
		if (typeof stripe.attr("data-original-menu-width") != "undefined"){
			totalLinksWidth = parseInt(stripe.attr("data-original-menu-width"));
		}else{
			totalLinksWidth = currentItem.find(".preview-item-links").outerWidth(true);
			if (stripe.css("display") != "none"){
				stripe.attr("data-original-menu-width",totalLinksWidth)
			}
		}
		
		
		var textSpace = 0;
		if (leftSideDiv.length > 0){
			textSpace = parseInt(leftSideDiv.width());
		}
		
		var shrinkerRelevantContainer = contentWrapper;
		if (menuAlign == "center"){
			if (masterContainer.hasClass("left-menu-layout")){
				totalLinksWidth = 0; //(no shrink at all)
				shrinkerRelevantContainer = holder.find(".item-wrapper");
			}else{
				textSpace = 0; //(shrink and center)
			}
		}
		
		//Shrink if needed
		if (leftSideDiv.outerWidth(true) + totalLinksWidth > shrinkerRelevantContainer.width()){
			var newFontSize = SpimeEngine.shrinkTextToFit(originalFontSize,shrinkerRelevantContainer,leftSideDiv,textElement,totalLinksWidth,15);
			if (newFontSize != -1){
				textElement.css("font-size",newFontSize);
			}
		}
		var atLeastOneLink = holder.find("#sr-basket-widget , .preview-element.Link.item-link").length > 0
		alwaysMinify = alwaysMinify && menuAlign=="left" && menuPosition=="top";
		
		//console.log( contentHolder.width() + " " +  totalLinksWidth + " " + textSpace + " " +  alwaysMinify +  " " +atLeastOneLink)
		
		if ((contentHolder.width() <= totalLinksWidth + textSpace || alwaysMinify) && menuPosition=="top" && atLeastOneLink){
			//if shrink is not working menufyLinks
			menu_layout.menufyLinks(container,currentItem.find(".preview-item-links"));
			//if menufy is not enough remove text
			if (contentHolder.width() < textSpace + rightSideDiv.width()){
				//console.log("still NO space ");
				leftSideDiv.find(".helper-div").hide(); 
			}
		}else{
			if (!alwaysMinify || !atLeastOneLink){
				menu_layout.unmenufyLinks(container,container.next(".preview-item-links"));
				
			}
		}
		
		if (!holder.hasClass("menu-open")){
			if (settings.attr("data-menu_overlay") == "absolute" && !holder.is(".being-scrolled")){
				holder.addClass("force-transparency");
				if (settings.attr("data-menu_overlay") == "absolute" && holder.css("position")!= "absolute"){
					 holder.css("position","absolute");
				}
			}
			if (settings.attr("data-menu_overlay") == "relative" && !holder.is(".being-scrolled")){
				if (settings.attr("data-menu_overlay") == "relative" && holder.css("position")!= "relative"){
					holder.css("position","relative");
					holder.removeClass("force-transparency");
				}
			}
		}
		menu_layout.updateBurgerColor(stripe.find(".preview-item-links"));
		menu_layout.adjustMenuScrolling(stripe);
	});
	
};

menu_layout.forceRedraw = function(elements){
	elements.each(function(){
		var element = $(this)[0];
		  var disp = element.style.display;
		  element.style.display = 'none';
		  var trick = element.offsetHeight;
		  element.style.display = disp;
	});
	
};

menu_layout.adjustMenuScrolling = function(stripe){
	var linksHolder =  stripe.find(".preview-item-links");
	var linksWrapper = linksHolder.find(".preview-links-wrapper");
	if (stripe.hasClass("full-screen-menu menu-open")){
		if (linksWrapper.outerHeight(true) + linksWrapper.outerHeight(true)/2 > $(window).innerHeight() - stripe.height() -50){
			if (!linksHolder.hasClass("transform-disabled")){
				linksHolder.addClass("transform-disabled")
				linksWrapper.css({"top":stripe.height()});
				//linksWrapper.closest(".preview-item-links").css({"overflow-y":"scroll","padding-right": "20px"})//.attr("id","scrolling-menu");
			}
		}else{
			linksWrapper.css({"top":""});
			//linksWrapper.closest(".preview-item-links").css({"overflow-y":"","padding-right": ""});
			linksHolder.removeClass("transform-disabled")
		}
	}else{
		if (linksHolder.hasClass("transform-disabled")){
			linksHolder.removeClass("transform-disabled")
		}
	}
};

menu_layout.handleScroll = function(holder,scrollPos){
	if (holder.hasClass("is-blocked")){
		return;
	}
	var settings = holder.find(".layout-settings");
	var menuAlign = settings.attr("data-menu_align");
	var menuPosition = settings.attr("data-menu_position");
	if(holder.find(".item-wrapper").innerWidth() < 400 && menuPosition!="left"){
		menuAlign = "left";
		holder.addClass("force-min-height50 minimal-design");
	}else{
		holder.removeClass("minimal-design");
	}
	if (settings.attr("data-menu_scroll") == "true"){
		if (scrollPos == 0){
			$("#menu-placeholder").remove();
			if (menuAlign == "center"){
				holder.addClass("center-aligned-menu");
			}
			holder.css({"position":settings.attr("data-menu_overlay")});
			holder.removeClass("animated-top");
			holder.css("top","");
			//holder.find(".preview-subtitle-holder").show();
			holder.find('.left-div').removeClass("scale-down08");
			if (holder.find(".item-wrapper").innerWidth() >= 400){
				holder.removeClass("force-min-height50");
			}
			holder.removeClass("being-scrolled");
			if (!holder.is(".menufied")){
				//holder.find('.right-div').css("height","");
			}
			if (settings.attr("data-menu_overlay") == "absolute"){
				holder.addClass("force-transparency");
			}
			menu_layout.forceRedraw(holder.find(".item-wrapper"))
		}else if(scrollPos < holder.outerHeight(true)){
			//console.log("still seen")
			//if(typeof window["EditorHelper"] != "undefined"){
				//if (holder.is(".being-scrolled")){
				//	holder.css("top",scrollPos);
				//}
			//}
			
		}else{
			if (holder.css("position") != "fixed" ){
				//Create a menu place holder to prevent the mobile scroll jump
				var menuHeight = parseInt(holder.css("height"));
				if (holder.parent().find("#menu-placeholder").length == 0 && !holder.is(".force-transparency")){
					var menuPlaceHolder = $("<div />").attr("id","menu-placeholder").css({"height":menuHeight,"width":"100%"});
					holder.after(menuPlaceHolder);
				}
				//holder.attr("data-orig-min-height", holder.css("min-height"));
				holder.removeClass("center-aligned-menu");
				holder.addClass("being-scrolled");
				holder.addClass("force-min-height50");
				holder.css({"position":"fixed","top":menuHeight*-1,"left":"0px"});
				holder.find('.left-div').addClass("scale-down08");
				holder.find('.right-div').css("height",holder.find('.left-div').height());
				//holder.find(".preview-subtitle-holder").hide();
				holder.addClass("animated-top");
				holder.removeClass("force-transparency");
				setTimeout(function(){
					var offsetFix = 0;
					//if(typeof window["EditorHelper"] != "undefined"){
						//offsetFix = scrollPos;
//						if ($(".site-thumb").lenght > 0){
//							offsetFix = 0;
//						}
					//}
					holder.css("top",offsetFix);	
				},10);
			}else{
				//if(typeof window["EditorHelper"] != "undefined" ){
				//	holder.removeClass("animated-top");
			//	holder.css("top",scrollPos);
				//}
			}
		}
	}
	
};


menu_layout.updateBurgerColor = function(linksHolder){
	var linksColor = linksHolder.find(".item-link").css("color");
	var styleForBurger = $("head style#for-burger");
	if (styleForBurger.length == 0){
		styleForBurger = $("<style>").attr("id","for-burger");
	}
	styleForBurger.text(".hamburger-inner:before,.hamburger-inner,.hamburger-inner:after {background-color:"+linksColor+";}")
	$('head').append(styleForBurger);
};

menu_layout.menufyLinks = function(container,linksHolder){
	var stripe = container.closest(".master.item-box");
	var settings = stripe.find(".layout-settings");
	var minifiyType = settings.attr("data-always_minified");
	
	var menuBtn = container.find(".links-menu-btn");
	//menuBtn.find(".hamburger-inner").css("background-color",linksColor);
	
	menuBtn.addClass("shown");
	if (container.next(".preview-item-links").length == 0){
		var allLinks = linksHolder.children();
		var menuBackground = container.find(".item-content").css("background-color");
		var menuMaxWidth = container.css("max-width");
		allLinks.addClass("flipped");
		stripe.addClass("menufied");
		if (!stripe.hasClass("menu-open")){
			//linksHolder.css({"max-width":menuMaxWidth,"background-color":menuBackground});
			linksHolder.hide();
		}
		
		//if (minifiyType != "false"){
			container.after(linksHolder);
			//linksHolder.css({"background-color":stripe.css("background-color")});
		//}
		
		
		
		stripe.attr("data-original-stripe-height" , stripe.height());
		
		menuBtn.unbind('click').bind('click', function(e){
			e.stopPropagation();
			menu_layout.burgerClick($(this),stripe,linksHolder);
		});
		
		
		if(typeof window["EditorHelper"] == "undefined"){
			linksHolder.unbind("click").bind("click",function(e){
				e.stopPropagation();
				menu_layout.burgerClick(menuBtn,stripe,linksHolder);
			});
		}
		
		stripe.find('.right-div').css("height",stripe.find('.preview-icon-holder').height());
	}
};


menu_layout.burgerClick = function(burger,stripe,linksHolder){
	if (!burger.hasClass("being-clicked")){
		burger.addClass("being-clicked")
		var settings = stripe.find(".layout-settings");
		var minifiyType = settings.attr("data-always_minified");
		linksHolder.removeClass("allow-bg-color");
		switch(minifiyType){
		case "true":
			menu_layout.handleMinifiedDefault(burger,stripe,linksHolder,settings);
			break;
		case "full_screen":
			linksHolder.addClass("allow-bg-color");
			menu_layout.handleMinifiedFullScreen(burger,stripe,linksHolder,settings);
			break;
		case "side_screen":
			linksHolder.addClass("allow-bg-color");
			menu_layout.handleMinifiedSideScreen(burger,stripe,linksHolder,settings);
			break;
		default:
			menu_layout.handleMinifiedDefault(burger,stripe,linksHolder,settings);
			break;
		}
		menu_layout.adjustMenuScrolling(stripe);
	}
};

menu_layout.handleMinifiedDefault = function(burger,stripe,linksHolder,settings){
	stripe.addClass("animated");
	burger.toggleClass("is-active");
	if (burger.hasClass("is-active")){
		stripe.removeClass("force-transparency");
		linksHolder.addClass("flipped");
		linksHolder.removeClass("no-place");
		stripe.addClass("menu-open");
		if (linksHolder.width() >=  stripe.width() && !linksHolder.is(".no-place")){
			linksHolder.addClass("no-place")
		}
		stripe.find(".item-content").addClass("flipped");
		burger.removeClass("being-clicked");
		linksHolder.slideDown(function(){
			
		});
	}else{
		linksHolder.slideUp(function(){
			stripe.removeClass("menu-open");
			if (settings.attr("data-menu_overlay") == "absolute" && !stripe.is(".being-scrolled")){
				stripe.addClass("force-transparency");
			}
		});
		burger.removeClass("being-clicked");
		
		linksHolder.removeClass("flipped");
		//linksHolder.css({"background-color":""});
	}
	
};

menu_layout.handleMinifiedFullScreen = function(burger,stripe,linksHolder,settings){
	burger.toggleClass("is-active");
	if (burger.hasClass("is-active")){
		//stripe.css("background-color","transparent")
		var master = $(".master.container");
		linksHolder.css({"margin-left":master.css("margin-left"),"margin-right":master.css("margin-right")});
		if (master.is(".narrow-site")){
			linksHolder.css("width","1000px");
		}
		$("body").addClass("noscroll");
		menu_layout.disableScroll();
		linksHolder.addClass("flipped");
		stripe.find(".item-content").addClass("flipped");
		linksHolder.fadeIn(function(){
			burger.removeClass("being-clicked")
		});
		stripe.addClass("full-screen-menu menu-open");
	}else{
		//stripe.css("background-color","")
		$("body").removeClass("noscroll");
		menu_layout.enableScroll();
		linksHolder.removeClass("flipped");
		linksHolder.fadeOut(function(){
			burger.removeClass("being-clicked")
			stripe.removeClass("full-screen-menu menu-open");
			//linksHolder.css({"background-color":""});
			linksHolder.css({"margin-left":"","margin-right":"","width":""})
		});
	}
};

menu_layout.handleMinifiedSideScreen = function(burger,stripe,linksHolder,settings){
	burger.toggleClass("is-active");
	if (burger.hasClass("is-active")){
		var master = $(".master.container");
		linksHolder.css({"margin-right":master.css("margin-right")})
		linksHolder.addClass("flipped");
		stripe.find(".item-content").addClass("flipped");
		stripe.addClass("side-screen-menu menu-open");
		linksHolder.show();
		setTimeout(function(){
			burger.removeClass("being-clicked")
			linksHolder.css("right","0px")
		},10)
		
	}else{
		linksHolder.css({"transition":"none"});
		linksHolder.animate({
			right:"-360px"
		  }, 1000, function() {
			  	burger.removeClass("being-clicked")
				linksHolder.hide();
				stripe.removeClass("side-screen-menu menu-open");
				linksHolder.css({"margin-right":"","right":"","transition":""});
		  });
		linksHolder.removeClass("flipped");
	}
};

menu_layout.handleMinifiedBoxed = function(burger,stripe,linksHolder,settings){
	burger.toggleClass("is-active");
	if (burger.hasClass("is-active")){
		stripe.removeClass("force-transparency");
		linksHolder.addClass("flipped");
		stripe.find(".item-content").addClass("flipped");
		linksHolder.css({"top":stripe.height()})
		linksHolder.fadeIn();
		stripe.addClass("boxed-menu menu-open");
	}else{
		linksHolder.removeClass("flipped");
		linksHolder.css("right","0px")
		//linksHolder.fadeOut(function(){stripe.removeClass("boxed-menu menu-open");});
		//if (settings.attr("data-menu_overlay") == "absolute" && !stripe.is(".being-scrolled")){
		//	stripe.addClass("force-transparency");
		//}
		
		
	}
	
};


menu_layout.disableScroll = function(){
	var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
};

menu_layout.enableScroll = function(){
	window.onscroll=function(){};
};

menu_layout.unmenufyLinks = function(container,linksHolder){
	var holder = container.closest(".master.item-box");
	if (holder.hasClass("menufied")){//container.next(".preview-item-links").length > 0){
		
		
		
		var menuLinksHolder = linksHolder.find(".menu-links-holder");
		//linksHolder.find("span").css({"display":"","margin-right":"","margin-left":""});
		linksHolder.css({"max-width":"","background-color":"","margin":""});
		holder.removeClass("menufied");
		//linksHolder.find(".links-menu-btn").removeClass("shown");
		container.find(".links-menu-btn").removeClass("shown");
		var allLinks = menuLinksHolder.children();
		allLinks.removeClass("flipped");
		container.find(".item-content").removeClass("flipped");
		linksHolder.append(allLinks);
		container.find(".right-div").prepend(linksHolder);
		var stripe = container.closest(".master.item-box");
		stripe.removeClass("animated");
		linksHolder.show();
		linksHolder.removeClass("flipped");
		//holder.find('.right-div').css("height","");
		holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
		linksHolder.removeClass("allow-bg-color");
		if (holder.hasClass("menu-open")){
			holder.find(".hamburger").click();
			setTimeout(function(){
				holder.find(".preview-item-links").css("display","");
			},1500);
		}
		holder.find(".preview-item-links").css("display","");
	}

};


menu_layout.calculateSubmenuBG = function(container,submenu){
	var menuBackground = container.find(".item-content").css("background-color");
	if (menuBackground.indexOf("rgba(") != -1 && menuBackground.indexOf(", 0)") != -1){
		menuBackground = container.closest(".master.item-box").css("background-color");
	}
	submenu.css("background-color",menuBackground);
};

