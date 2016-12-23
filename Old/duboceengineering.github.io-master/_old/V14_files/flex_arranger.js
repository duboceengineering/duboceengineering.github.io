var flex_arranger = {};

 

flex_arranger.init = function(container,items,whatsNext,title){
	SpimeEngine.DebugPrint("flex arranger init for " + items.length + " items and container: " + container.width() + " X " + container.height());
	container.css("overflow","hidden")
	var itemsHolder = container.find("#items-holder");
	var itemsHolderWrapper = container.find("#items-holder-wrapper");
	 //backward compatibility
	 if (itemsHolder.length == 0){
		 items = container.find(".sub.item-box");
		 itemsHolder = $("<div id='items-holder' />");
		 itemsHolderWrapper = $("<div id='items-holder-wrapper' />");
		 itemsHolder.append(items);
		 itemsHolderWrapper.append(itemsHolder);
		 container.find("#children").append(itemsHolderWrapper);
	 }
	items = itemsHolder.children();
	//if we have elements in the container remove them
	var elements = items.not(".element-box").first().siblings(".element-box");
	elements.remove();
	//create the arrows
	var flexArrows = container.find(".flex-arrows");
	var leftArrow = flexArrows.filter(".left");
	var rightArrow = flexArrows.filter(".right");
	var staticServer = XPRSHelper.getStaticServerPath();
	if (flexArrows.length == 0){
		rightArrow = $("<img />");
		rightArrow.attr("src",staticServer + "/images/right_arrow.png");
		rightArrow.addClass("flex-arrows").addClass("right").addClass("layer5");
		leftArrow = $("<img />");
		leftArrow.attr("src",staticServer + "/images/left_arrow.png");
		leftArrow.addClass("flex-arrows").addClass("left").addClass("layer5");
		itemsHolder.parent().prepend(leftArrow).prepend(rightArrow);
	}
	rightArrow.unbind("click").bind("click",function(event){
		event.stopPropagation();
		if (container.attr("data-interval-id")){
			clearInterval(parseInt(container.attr("data-interval-id")));
		}
		flex_arranger.slide(rightArrow,"right",items,container);
	});
	leftArrow.unbind("click").bind("click",function(event){
		event.stopPropagation();
		if (container.attr("data-interval-id")){
			clearInterval(parseInt(container.attr("data-interval-id")));
		}
		flex_arranger.slide(leftArrow,"left",items,container);
	});
	items.attr("data-child-type","SLIDE");
	
	this.handlePagination(items,container);
	if (typeof  whatsNext != "undefined"){
		 whatsNext();
	}
	
	if (typeof container.attr("start-with-slide") != "undefined"){
		items.filter(".slide-" + container.attr("start-with-slide")).attr("data-visible","visible").css("left",0).addClass("play-effect");
	}else{
		items.first().attr("data-visible","visible").css("left",0).addClass("play-effect");
	}
	
	container.unbind("swipeleft").bind("swipeleft",function(){
		if (items.length > 1){
			if (container.attr("data-interval-id")){
				clearInterval(parseInt(container.attr("data-interval-id")));
			}
	    	flex_arranger.slide(rightArrow,"right",items,container);
		}
	});
	
	container.unbind("swiperight").bind("swiperight",function(){
		if (items.length > 1){
			if (container.attr("data-interval-id")){
				clearInterval(parseInt(container.attr("data-interval-id")));
			}
	    	flex_arranger.slide(leftArrow,"left",items,container);
		}
	});


};

flex_arranger.arrange = function(items,container){
	SpimeEngine.DebugPrint("flex arranger arrange for " + items.length + " items and container: " + container.width() + " X " + container.height());
	var itemsHolder = container.find("#items-holder");
	items = itemsHolder.children();
	var stripe = container.closest(".master.item-box");
	var flexArrows = container.find(".flex-arrows");
	var settings = stripe.find(".arranger-settings");
	if (stripe.width() < 400){
		flexArrows.addClass("disabled");
	}else{
		flexArrows.removeClass("disabled");
	}
	var autoPlay = settings.attr("data-auto_play") == "AUTOPLAY";
	var autoPlayDuration = parseInt(settings.attr("data-auto_play_duration"));
	var allowAutoPlay = !($("#xprs").hasClass("in-editor"));
	allowAutoPlay = allowAutoPlay || (typeof stripe.attr("data-auto_play-from-settings") != "undefined");
	allowAutoPlay = allowAutoPlay && items.length > 1;
	stripe.removeAttr("data-auto_play-from-settings");
	
	var effectsClass = settings.attr("data-flex_element_effect");
	if (effectsClass == ""){
		var newClass = container.find('.preview-content-holder').attr("class").replace(/\seffect-[^\s]*|^effect-[^\s]*\s+/g,"");
		container.find('.preview-content-holder').attr("class",newClass);
	}else{
		container.find('.preview-content-holder').addClass(effectsClass);
	}
	
	var durationSettingsChanged = stripe.attr("data-auto_play_duration-from-settings") || stripe.attr("data-forced-arrange");
	stripe.removeAttr("data-forced-arrange");
	if (durationSettingsChanged){
		stripe.removeAttr("data-auto_play_duration-from-settings");
		if (container.attr("data-interval-id")){
			clearInterval(parseInt(container.attr("data-interval-id")));
			container.removeAttr("data-interval-id");
		}
	}
	if (autoPlay && !container.attr("data-interval-id")){
		
		var rightArrow = flexArrows.filter(".right");
		var intervalId = setInterval(function(){
			if (!stripe.hasClass("manage-mode") && allowAutoPlay){
				flex_arranger.slide(rightArrow,"right",items,container);
			}
		},autoPlayDuration*1000);
		container.attr("data-interval-id" , intervalId);
	}else{
		if (!autoPlay){
			if (container.attr("data-interval-id")){
				clearInterval(parseInt(container.attr("data-interval-id")));
			}
		}
	}
	
	if (items.length == 1 ){
		container.find(".flex-arrows").hide();
	}else{
		container.find(".flex-arrows").show();
	}
	var rightArrow = container.find(".flex-arrows.right");
	var leftArrow = container.find(".flex-arrows.left");
	var newTop = container.height()/2 - rightArrow.height/2;
	leftArrow.css({"float":"none","left":0,"top":newTop,"position":"absolute"});
	rightArrow.css({"float":"none","right":0,"top":newTop,"position":"absolute"});
	container.find("#paginator").css("bottom", 50);
	items.each(function(){
		var currentItem = $(this);
		currentItem.css("width",container.width());
	});

	container.find("#items-holder").width(parseInt(container.width()) * items.length);
	
	var visibleItem = items.filter("[data-visible='visible']");
	if (visibleItem.length  == 0 ){
		items.removeAttr("data-visible");
		visibleItem = items.first();
		visibleItem.attr("data-visible","visible");
		visibleItem.addClass("play-effect");
	}
	
	items.removeClass("before-visible after-visible")
	visibleItem.nextAll().addClass("after-visible");
	visibleItem.prevAll().addClass("before-visible");
	
	var itemsNewLeft = visibleItem.index() * -1 * visibleItem.width();
	items.each(function(){
		var currentItem = $(this);
		currentItem.css("left",itemsNewLeft);
	});

	
	
};

flex_arranger.slide = function(btn,direction,items,container){
	var currentVisible = items.filter('[data-visible="visible"]');
	var nextVisible = currentVisible.prev();
	if (direction=="left"){
		if(nextVisible.length==0){
			nextVisible = items.last();
			flex_arranger.showPage(nextVisible.attr("data-page-num"),container,items);
		}else{
			flex_arranger.showPage(nextVisible.attr("data-page-num"),container,items);
		}
	}else{
		nextVisible = currentVisible.next();
		if(nextVisible.length==0){
			nextVisible = items.first();
			flex_arranger.showPage(nextVisible.attr("data-page-num"),container,items);

		}else{
			flex_arranger.showPage(nextVisible.attr("data-page-num"),container,items);

		}
		
	}


};



flex_arranger.showItem = function(container,items,itemId){
	var nextVisible = items.filter("#" + itemId);
	var itemToShowPageNum = nextVisible.attr("data-page-num");
	flex_arranger.showPage(itemToShowPageNum,container,items);
};

flex_arranger.showPage = function(pageNum,container,items){
	container.find(".page-navigator").removeClass("active");
	//container.find(event.target).addClass("active");
	
	container.find(".page-navigator").removeClass("active");
	container.find("#nav" + pageNum).addClass("active");
	
	var pageToShow = items.filter(".slide-" + pageNum);
	items.removeAttr("data-visible");
	pageToShow.attr("data-visible","visible");
	items.removeClass("before-visible after-visible")
	pageToShow.nextAll().addClass("after-visible");
	pageToShow.prevAll().addClass("before-visible");
	//var currentVisibleLeft = parseInt(pageToShow.css("left"));
	var pageToShowIndex = pageToShow.index();
	var itemsNewLeft = pageToShowIndex * -1 * pageToShow.width();
	//if (currentVisibleLeft < 0){
		items.each(function(){
			var currentItem = $(this);
			//var currentLeft = parseInt(currentItem.css("left"));
			//var newLeft = currentLeft + (currentVisibleLeft * -1);
			currentItem.css("left",itemsNewLeft);
		});
		items.removeClass("play-effect");
		flex_arranger.emulateTransitionEnd (pageToShow,1050,function(){
			pageToShow.addClass("play-effect");
		});
		
	//}else{
//		items.each(function(){
//			var currentItem = $(this);
//			var currentLeft = parseInt(currentItem.css("left"));
//			var newLeft = currentLeft - currentVisibleLeft;
//			currentItem.css("left",newLeft);
//		});
//	}
};

flex_arranger.handlePagination = function(items,container){
	
	items.each(function(idx){
		var currentItem = $(this);
		currentItem.removeClass (function (index, className) {
		    return (className.match (/(^|\s)slide-\S+/g) || []).join(' ');
		});
		currentItem.addClass("slide-" + (idx + 1)).attr("data-page-num",(idx + 1));
	});
	var numOfPages = items.length;
	

	container.find(".page-navigator").remove();
	container.find("#paginator").remove();
	var paginator = $("<div />").attr("id","paginator");
	for(var i=1;i <= numOfPages; i++){
		var pageNavigator = $("<div />").attr("id","nav"+i).addClass("page-navigator").attr("data-page-num",i).click(function(e){
			e.stopPropagation();
			if (container.attr("data-interval-id")){
				clearInterval(parseInt(container.attr("data-interval-id")));
			}
			flex_arranger.showPage($(this).attr("data-page-num"),container,items);
		});
		paginator.append(pageNavigator);
	}
	
	//paginator.css("left",parseInt(container.width())/2);
	//paginator.css("top",parseInt(container.height()) - 40);
	
	
	container.find("#items-holder-wrapper").append(paginator);
	
	var paginationWidth = parseInt(paginator.width());
	paginatorNeMargin = paginationWidth / -2; 
	paginator.css("margin-left",paginatorNeMargin);
	if (items.length == 1){
		paginator.hide();
	}else{
		paginator.show();
	}
	
	container.find("#nav1").addClass("active");
	
};


flex_arranger.emulateTransitionEnd = function(element,duration,callbackFunc) {
	  var called = false;
	  element.one('webkitTransitionEnd', function() { called = true; callbackFunc();});
	  var callback = function() { if (!called) element.trigger('webkitTransitionEnd'); };
	  setTimeout(callback, duration);
	};



