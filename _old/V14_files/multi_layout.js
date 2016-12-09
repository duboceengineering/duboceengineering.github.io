var multi_layout = {};

multi_layout.init = function(container,items){
	//items.find(".image-cover").css("min-height","inherit");
	items = items.not(".stripe-header").not(".stripe-footer");
	items.each(function(){
		var helperDiv = $(this).find(".helper-div");
		//there is no class to helperdiv (usually on switching to multi) 
	//	if (helperDiv.attr("class").indexOf("top") == -1 && helperDiv.attr("class").indexOf("middle") == -1 && helperDiv.attr("class").indexOf("bottom") == -1){
	//		helperDiv.addClass()
	//	}
		var picSide = $(this).find(".pic-side");
		var textSide = $(this).find(".text-side");
		if (helperDiv.is(".top-center")){
			picSide.before(textSide);
		}else{
			picSide.after(textSide);
		}
	});
};

multi_layout.applyLayout = function(container,items,paramsFromRealTime){
	items = items.not(".stripe-header").not(".stripe-footer");
	var textVerticalAligner;//if it is bigger that the pic side we should flip?
	var helperDiv = items.find(".helper-div");
	var picSide = items.find(".pic-side");
	var textSide = items.find(".text-side");
	
	
	items.find(".image-cover , .item-preview").css("min-height","inherit");
	
	//Handle Ratio
	if (container.find(".arranger-settings").length > 0){
		var arrangerSettings = container.find(".arranger-settings");
		if (arrangerSettings.attr("data-arranger_type") == "matrix"){
			var isMazonite = arrangerSettings.attr("data-arranger_order_type") == "mazonite";
			var ratioFromArranger = parseFloat(arrangerSettings.attr("data-arranger_item_ratio")).toFixed(1);
			items.each(function(){
				var currentItem = $(this);
				var innerPic = currentItem.find(".inner-pic");
				if (isMazonite){
					var origHeight = innerPic.attr("data-orig-height");
					var origWidth = innerPic.attr("data-orig-width");
					if (origHeight && origWidth){
						ratioFromArranger = parseInt(origHeight) / parseInt(origWidth)
					}else{
						if (innerPic.attr("id") != "no-image"){
							container.closest(".master.item-box").addClass("rearrange");
						}
						ratioFromArranger = 0;
					}
					
				}
				var newPicHeight = currentItem.find(".pic-side").width() * ratioFromArranger;
				if (currentItem.find(".video-frame").length > 0 && isMazonite){
					//found video
					newPicHeight = currentItem.find(".pic-side").width() * (9/16);
				}
				if (helperDiv.is(".top-center") || helperDiv.is(".bottom-center")){
					innerPic.css({"height":newPicHeight});	
					currentItem.find(".helper-div").css({"min-height":""});
				}else{
					currentItem.find(".helper-div").css({"min-height":newPicHeight});	
					innerPic.css({"height":""});	
				}
			});
			
		}else{
			items.find(".item-details").css("height","")
			if (helperDiv.is(".top-center") || helperDiv.is(".bottom-center")){
				items.each(function(){
					var currentItem = $(this)
					var textHeight = currentItem.find(".item-details").outerHeight(true);
					var newHeight = currentItem.height() - textHeight
					currentItem.find(".inner-pic").css("height",newHeight);
					//if (currentItem.find(".inner-pic").is(".circlize")){
					//	console.log("here")
					//}
				});
			}else{
				picSide.find(".inner-pic").css({"height":""});	
			}
		}
	}else{
		items.find(".item-details").css("height","")
		if (helperDiv.is(".top-center") || helperDiv.is(".bottom-center")){
			items.each(function(){
				var currentItem = $(this)
				var textHeight = currentItem.find(".item-details").outerHeight(true);
				var newHeight = currentItem.height() - textHeight
				currentItem.find(".inner-pic").not(".circlize").css("height",newHeight);
				if (currentItem.find(".inner-pic").is(".circlize")){
					currentItem.find(".pic-side").not(".circlize").css("height",newHeight);
				}
			});
		}else{
			picSide.find(".inner-pic").css({"height":""});	
		}
	}
		
	
	
	
	if (container.width() < 500){
		//if (!picSide.attr("data-prev-height")){
			//picSide.attr("data-prev-height",picSide[0].style.height)
			//picSide.css("min-height","");
			//picSide.css("height","");
			//picSide.addClass("reset")
		//}
		if (!helperDiv.is(".middle-center") &&  !helperDiv.is(".top-center") && !helperDiv.is(".bottom-center")){
			items.each(function(){
				multi_layout.flipVertically($(this));
			});
		}
		//multi_layout.init(container,items); //cause edited text to loose focus
		
	}else{
		if (helperDiv.attr("data-orig-class")){
		items.each(function(){
			multi_layout.unflip($(this));
		});
		//multi_layout.init(container,items); //cause edited text to loose focus
		
		//picSide.css("min-height",picSide.attr("data-prev-height"));
		picSide.css("top","")
		textSide.find(".vertical-aligner").css("min-height","")
				
		}
		//picSide.css("bottom","")
		//picSide.css("height",picSide.attr("data-prev-height"));
		//picSide.removeAttr("data-prev-height");
		//picSide.removeClass("reset")
	}
	
	if (paramsFromRealTime && "force_redraw" in paramsFromRealTime){
		multi_layout.forceRedraw($(".item-wrapper"));
	}
	//items.find(".background-div, .item-preview, .preview-image-holder,.text-side, .vertical-aligner , .inner-pic").css("min-height","inherit");
	//, .text-side, .vertical-aligner, .inner-pic
	//textSide.css("height","");
	if (helperDiv.is(".top-center") || helperDiv.is(".bottom-center")){
		var insideSlideshow = container.is(".flex");
		//multi_layout.handleVerticalLayouts(items,insideSlideshow,helperDiv);
	}
	if (helperDiv.is(".middle-center")){
			items.each(function(){
				var currentItemDetails = $(this).find(".item-details");
				var draggableImages = $(this).find(".draggable-div-holder");
				if (currentItemDetails.css("text-align") == "center" || currentItemDetails.css("text-align") == "right"){
					var divisor = 2;
					if ( currentItemDetails.css("text-align") == "right"){
						divisor = 1;
					}
					var textSideMaxWidth = $(this).find(".text-side").css("max-width");
					if (textSideMaxWidth != "none"){
						textSideMaxWidth = parseInt(textSideMaxWidth);
						if (draggableImages.width() < textSideMaxWidth ){
							var newMarginLeft = (textSideMaxWidth - draggableImages.width())/divisor * -1;
							draggableImages.css("margin-left",newMarginLeft);
						}else{
							draggableImages.css("margin-left",0);
						}
					}
				}
				
				if ( currentItemDetails.css("vertical-align") == "top"){
					draggableImages.css("margin-top",0);
				}
				
				if ( currentItemDetails.css("vertical-align") == "middle" || currentItemDetails.css("vertical-align") == "bottom"){
					if (currentItemDetails.css("vertical-align") == "bottom"){
						if (!draggableImages.is(".bottomized")){
							draggableImages.addClass("bottomized");
							draggableImages.css({"top":"auto","bottom":0});
							draggableImages.css("margin-top",0);
						}
					}else{
						if (draggableImages.is(".bottomized")){
							draggableImages.css({"bottom":"","top":""});
							draggableImages.removeClass("bottomized");
						}
						var itemDetailsHeight = parseInt(currentItemDetails.innerHeight());
						var stripeHeight = parseInt($(this).closest(".master.item-box").height());
						if (itemDetailsHeight <= stripeHeight ){
							var newMarginTop = (stripeHeight - draggableImages.height())/2;
							draggableImages.css("margin-top",newMarginTop);
						}else{
							draggableImages.css("margin-top",0);
						}
					}
				}
				
			});
	}

};


multi_layout.forceRedraw = function(elements){
	//setting body height to prevent jitter 
	$("body").css("height",$("body").height())
	elements.each(function(){
		var element = $(this)[0];
		  var disp = element.style.display;
		  element.style.display = 'none';
		  var trick = element.offsetHeight;
		  element.style.display = disp;
	});
	$("body").css("height","")
};


multi_layout.handleVerticalLayouts = function(items,insideSlideshow,helperDiv,fromFlip){
	
//	var maxHeight = 0;
//	var innerMaxHeight = 0;
//	var maxItemBoxHeight = 0;
//	if (!insideSlideshow){
//		items.each(function(){
//			textSideHeight = $(this).find(".text-side").outerHeight(true);
//			maxHeight = Math.max(maxHeight,textSideHeight);
//			var itemContent = $(this).find(".item-content").andSelf().filter(".item-content");
//			maxItemBoxHeight = Math.max(maxItemBoxHeight,itemContent.height());
//			innerMaxHeight = Math.max(innerMaxHeight,$(this).find(".text-side").outerHeight());
//		});
//	}
//	var fromWidthResize = items.closest(".master.item-box[data-width-resize=true]").length > 0
//	items.each(function(){
//		var currentItem = $(this)
//		var itemContent = currentItem.find(".item-content").andSelf().filter(".item-content");
//		if (!insideSlideshow){
//			//currentItem.find(".text-side").height(innerMaxHeight);
//		}else{
//			
//			maxItemBoxHeight = itemContent.height();
//		}
//		
//		itemBoxHeight =  itemContent.height();
//	});
};


multi_layout.flipVertically = function(itemToFlip){
	var helperDiv = itemToFlip.find(".helper-div");
	var currentClass = helperDiv.attr("class").replace("helper-div", "").replace(" ","");
	if (currentClass=="top-left" || currentClass=="middle-left" || currentClass=="bottom-left"){
		helperDiv.removeClass("top-left top-center top-right middle-left middle-center middle-right bottom-left bottom-center bottom-right");
		helperDiv.addClass("top-center");
		helperDiv.attr("data-orig-class",currentClass);
		helperDiv.addClass("flipped-image")
	}
	if (currentClass=="top-right" || currentClass=="middle-right" || currentClass=="bottom-right"){
		helperDiv.removeClass("top-left top-center top-right middle-left middle-center middle-right bottom-left bottom-center bottom-right");
		helperDiv.addClass("bottom-center");
		//multi_layout.handleVerticalLayouts(itemToFlip,itemToFlip.closest(".flex").length > 0,itemToFlip.find(".helper-div"),true);
		helperDiv.attr("data-orig-class",currentClass);
		helperDiv.addClass("flipped-image")
	}
};

multi_layout.unflip = function(itemToUnFlip){
	var helperDiv = itemToUnFlip.find(".helper-div");
	itemToUnFlip.find(".inner-pic").css({"height":""});
	if (helperDiv.attr("data-orig-class")){
		helperDiv.removeClass("top-left top-center top-right middle-left middle-center middle-right bottom-left bottom-center bottom-right");
		helperDiv.addClass(helperDiv.attr("data-orig-class"));
		helperDiv.removeAttr("data-orig-class")
		helperDiv.removeClass("flipped-image")
	}
};

