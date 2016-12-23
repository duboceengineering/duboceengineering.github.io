var matrix_arranger = {};

matrix_arranger.init = function(container,items,whatsNext){
	 SpimeEngine.DebugPrint("rowcol arranger init for " + items.length + " items and container: " + container.width() + " X " + container.height());
	 var settings = container.closest(".item-wrapper").find(".arranger-settings");
	 /******************************************************************
		 *           HANDLING THE ELEMENTS
	 ********************************************************************/
//	var elements = items.not(".element-box").first().siblings(".element-box");
	//var stripeHeader
//	elements.remove();
	 
	 /******************************************************************
		 *           HANDLING THE ITEMS
	********************************************************************/
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
//	 var itemsHolderWrapper = container.find("#items-holder-wrapper");
	//Select only children of type item
//	 var onlyItems = items.not(".element-box").not(".stripe_header");
//	 if (itemsHolder.length == 0){
//		 itemsHolder = $("<div id='items-holder' />");
//		 itemsHolderWrapper = $("<div id='items-holder-wrapper' />");
//		 itemsHolder.append(onlyItems);
//		 itemsHolderWrapper.append(itemsHolder);
//		 container.find("#children").append(itemsHolderWrapper);
//	 }
	 
	 var pagHolder = container.find("#pagination-holder");
	 if (pagHolder.length == 0){
		 matrix_arranger.initPaginationHolder(container);
	 }
	 
	 if (typeof  whatsNext != "undefined"){
		 whatsNext();
	 }
	 
	//set original height
	items.find(".inner-pic").each(function(){
		SpimeEngine.updateImageRealSize($(this));
	});
};

matrix_arranger.arrange = function(items,container,whatsNext){
	SpimeEngine.DebugPrint("rowcol arranger arrange for " + items.length + " items and container: " + container.width() + " X " + container.height());
	
	/******************************************************************
	 *           HANDLING THE ELEMENTS
	 ********************************************************************/
	//var elementsHolder = container.find("#elements-holder");
	var itemsHolder = container.find("#items-holder");
	items = itemsHolder.children();
	var calculatedElementsHeight = 0;
	
	var stripe = container.closest(".master.item-box");
	stripe.css("min-height","initial");
	var stripeType = stripe.attr("data-preset-type-id");
	var isFeatures = false//XPRSHelper.inPresetGroup(stripeType,"FEATURES");


	/******************************************************************
	 *           LOADING ARRANGER SETTINGS
	 ********************************************************************/
	
	var settings = container.closest(".item-wrapper").find(".arranger-settings");
	var ratio = parseFloat(settings.attr('data-arranger_item_ratio')) ;
	var colsFromSettings = parseInt(settings.attr('data-arranger_cols'));
	colsFromSettings = isFeatures ? items.length : colsFromSettings;
	colsFromSettings = Math.min(items.length,colsFromSettings);
	var itemsMargin =  parseInt(settings.attr('data-arranger_item_spacing'));
	var itemMinWidth = parseInt(settings.attr('data-arranger_item_min_width'));
	var itemMaxWidth = parseInt(settings.attr('data-arranger_item_max_width'));
	var itemsPerPage = settings.attr('data-arranger_items_per_page');
	itemsPerPage = isFeatures ? items.length : itemsPerPage;
	itemsPerPage = (itemsPerPage == "all") ? items.length : parseInt(itemsPerPage);
	
	
	/******************************************************************
	 * DEFINE PARTICIPATING DIVS        
	 ********************************************************************/
	//ParentWrapper is the source for our max width
	var parentWrapper = itemsHolder.closest(".gallery-wrapper");
	
	var forcedArrange = (typeof stripe.attr("data-forced-arrange") != "undefined");
	var fromHeightResize = (typeof stripe.attr("data-height-resize") != "undefined");
	var fromWidthResize = forcedArrange || (typeof stripe.attr("data-width-resize") != "undefined") || (typeof stripe.attr("data-arranger_cols-from-settings") != "undefined")|| (typeof stripe.attr("data-arranger_item_spacing-from-settings") != "undefined");
	//fromWidthResize = false
	stripe.removeAttr("data-forced-arrange");
	var paginationWrapper =  container.find("#pagination-wrapper");
	var paginationHeight = paginationWrapper.is(':visible') ? paginationWrapper.outerHeight(true) : 0;
	//var stripeHeight = stripe.height() - calculatedElementsHeight - paginationHeight;//- parseInt(stripe.css("padding-top")) - parseInt(stripe.css("padding-bottom"));
	
	/******************************************************************
	 * START CALCULATIONS WITH ITEM MIN WIDTH AND HEIGHT * RATIO AND COLS AS THE NUMBER OF ITEMS      
	 ********************************************************************/
	var percentagePaddingFix = 0;
	if (parseInt(stripe.css("padding-left")) > 0){
		percentagePaddingFix = 1;
	}
	var wrapperWidth = parentWrapper.width() - percentagePaddingFix;
	//Min width can not be larger than  screen or the max item width
	itemMinWidth = Math.min(itemMinWidth,itemMaxWidth);
	itemMinWidth = Math.min(itemMinWidth,wrapperWidth);
	items.find(".preview-content-holder").css("min-height","");
	
	var cols = Math.floor((wrapperWidth + itemsMargin*2) / (itemMinWidth + itemsMargin*2));
	cols = Math.min(colsFromSettings,cols);
	if (forcedArrange){//if (fromWidthResize){
		var wrapperWidthForTest = wrapperWidth - colsFromSettings*itemsMargin*2 + itemsMargin*2;
		itemMinWidth =   Math.floor(wrapperWidthForTest / colsFromSettings);
		itemMinWidth = Math.min(itemMinWidth,itemMaxWidth);
		itemMinWidth *= 0.7;
		cols = colsFromSettings;
	}
	//cols must be at least 1
	cols =  Math.max(cols,1);
	
	if (cols == 2 && colsFromSettings != 2 && items.length == 3){
		cols = 1;
	}
	
	if (cols == 3 && items.length == 4 && colsFromSettings != 3){
		cols = 2;
	}
	if (cols == 5 && items.length == 6 && colsFromSettings != 5){
		cols = 3;
	}
	
	//The total number of rows we have
	var rows = Math.ceil(items.length / cols);
	//Restoring items defaults (if change during previous arrange)
	//items.show();
	items.css({"clear":"","display":"inline-block"});
	var itemRow = 0;
	
	/******************************************************************
	 * BREAK THE ITEMS ACCORDING TO CALCULATED COLS AND GIVE EACH ONE ROW IDENTIFIER 
	 ********************************************************************/
	
	var maxContentHeight = 0;
	items.removeClass("top-side").removeClass("bottom-side").removeClass("left-side").removeClass("right-side");;
	items.each(function(idx){
		if (idx % cols == 0){
			$(this).css({"clear":"left"});
			$(this).addClass("left-side");
			itemRow++;
		}
		if (idx % cols == cols-1){
			$(this).addClass("right-side");
		}
		if (itemRow == 1){
			$(this).addClass("top-side");
		}
		if (itemRow == rows){
			$(this).addClass("bottom-side");
		}
		$(this).attr("data-row",itemRow);
		maxContentHeight = Math.max(maxContentHeight,$(this).find(".preview-content-holder").height()); 
	});
	
	
	//maxContentHeight = Math.max(itemsHolder.height(),maxContentHeight);
	
	
	//if we have more space we enlarge the items 
	var extraSpace = Math.floor(    (wrapperWidth - (cols*itemMinWidth) - (cols*itemsMargin*2) + (itemsMargin*2) )  /cols     );
	var	calculatedItemWidth = Math.floor(itemMinWidth + extraSpace);//Math.round((wrapperWidth)/cols) - ((cols-1)*(itemsMargin*2));
	calculatedItemWidth = Math.min(calculatedItemWidth,itemMaxWidth);
	
	setTimeout(function(){
		if (wrapperWidth - parentWrapper.width() > 3){
			extraSpace = Math.floor(    (parentWrapper.width() - (cols*itemMinWidth) - (cols*itemsMargin*2) + (itemsMargin*2) )  /cols     );
			calculatedItemWidth = Math.floor(itemMinWidth + extraSpace);//Math.round((wrapperWidth)/cols) - ((cols-1)*(itemsMargin*2));
			calculatedItemWidth = Math.min(calculatedItemWidth,itemMaxWidth);
			items.width(calculatedItemWidth);
		}
	},10);
	
	if (fromWidthResize || forcedArrange){
		//calculatedItemWidth = itemMinWidth;
		settings.attr('data-arranger_item_min_width',itemMinWidth);
		stripe.attr("data-items-min-width",itemMinWidth);
	}

	/******************************************************************
	 * CHANGE ITEMS WIDTH HEIGHT AND SPACING ACCORDING TO CALCULATIONS
	 ********************************************************************/
	items.width(calculatedItemWidth).css({"margin":itemsMargin});
	items.filter(".top-side").css("margin-top",itemsMargin*2);
	items.filter(".bottom-side").css("margin-bottom",itemsMargin*2);
	items.filter(".left-side").css("margin-left",0);
	items.filter(".right-side").css("margin-right",0);
	

	itemsHolder.css({"text-align":""});
	
	items.slice(itemsPerPage,items.length).hide();
	

	
	
	
	/******************************************************************
	 * HANDLE PAGINATION
	 ********************************************************************/
	// If we need pagination (not all items fit the given height)
	var inMoreMode = (typeof stripe.attr("data-more-clicked") != "undefined");
	if (itemsPerPage < items.length ){
		if (inMoreMode){
			paginationWrapper.hide();
			items.css("display","inline-block");
		}else{
			paginationWrapper.show();
		}
	}else{
		//Hide paginator
		paginationWrapper.hide();
	}
	
	
	extraSpace = Math.floor(    (wrapperWidth - (cols*itemMaxWidth) - (cols*itemsMargin*2) + (itemsMargin*2) )  /cols     );
	if(calculatedItemWidth == itemMaxWidth && extraSpace > 0){
		itemsHolder.css("text-align","center");
		var currentRowWidth = (itemMaxWidth * cols) + (cols*itemsMargin*2) - itemsMargin*2;
		itemsHolder.width(currentRowWidth);
	}else{
		itemsHolder.css("width","");
	}

	if (typeof  whatsNext != "undefined"){
		var originalItemMinWidth = parseInt(settings.attr('data-arranger_item_min_width'));
		var actualItemMinWidth = itemMinWidth;
		if (actualItemMinWidth != originalItemMinWidth){
			stripe.attr("data-items-min-width",actualItemMinWidth);
		}
		whatsNext();
	 }

};

matrix_arranger.showMore = function(stripe){
	
	var itemsHolder = stripe.find("#items-holder");
	var items = itemsHolder.children();
	var paginationWrapper = stripe.find("#pagination-wrapper");
	paginationWrapper.hide();
	var itemsWrapper = stripe.find("#items-holder-wrapper");
	var topMargin = parseInt(itemsWrapper.css("margin-top"));
	itemsWrapper.css("margin-bottom",topMargin);
	items.css("display","inline-block");
	SpimeEngine.fitVideos(stripe);
	stripe.attr("data-more-clicked","true");
};

matrix_arranger.showLess = function(stripe){
	var itemsHolder = stripe.find("#items-holder");
	var items = itemsHolder.children();
	var paginationWrapper = stripe.find("#pagination-wrapper");
	var itemsWrapper = stripe.find("#items-holder-wrapper");
	//var topMargin = parseInt(itemsWrapper.css("margin-top"));
	itemsWrapper.css("margin-bottom","");
	var itemsToShow = parseInt(stripe.attr("data-items-to-show"));
	if (itemsToShow < items.length){
		paginationWrapper.show();
	}
	items.hide();
	items.slice(0,itemsToShow).css("display","inline-block")
	stripe.removeAttr("data-more-clicked");
};



matrix_arranger.initPaginationHolder = function(container){
	var paginationBtn = $("<div id='pagination-btn' />");
	paginationBtn.text("More");
	var paginationHolder = $("<div id='pagination-holder' />").addClass("magic-circle-holder").attr("data-menu-name","PAGINATION_SETTINGS");
	var paginationHolderWrapper = $("<div id='pagination-wrapper' class='layer5' />");
	paginationHolder.append(paginationBtn);
	paginationHolderWrapper.append(paginationHolder);
	container.find("#children").append(paginationHolderWrapper);
	paginationHolder.unbind("click").bind("click",function(e){
		e.stopPropagation();
		var stripe = container.closest(".master.item-box");
		matrix_arranger.showMore(stripe);
	});
};






