var stripes_arranger = {};

stripes_arranger.init = function(container,items,whatsNext){
	SpimeEngine.DebugPrint("stripes arranger init for " + items.length + " items and container: " + container.width() + " X " + container.height());
	items.each(function(){
		var currentItem = $(this);
		if (currentItem.hasClass("element-box")){
			var textElement = currentItem.find(".text-element");
			if (textElement.length > 0){
				textElement.each(function(){
					$(this).attr("data-orig-font-size",parseInt($(this).css("font-size")));
				});
			}
		}
	});
	if (typeof  whatsNext != "undefined"){
		 whatsNext();
	}
};

stripes_arranger.arrange = function(items,container){
	SpimeEngine.DebugPrint("stripes arranger arrange for " + items.length + " items and container: " + container.width() + " X " + container.height());
	items.each(function(idx){
		var currentItem = $(this);
		if (currentItem.hasClass("element-box")){
			
			
			
//			var currentItem = $(this);
//			var textElement = currentItem.find(".preview-title");
//			var contentHolder = currentItem.find(".preview-content-holder");
//			var contentWrapper = currentItem.find(".preview-content-wrapper");
//			var originalFontSize = parseInt(textElement.attr("data-orig-font-size"));
//			if (typeof currentItem.attr("data-flipped") != "undefined"){
//				contentWrapper = currentItem.find(".helper-div"); 
//			}
//			textElement.css("font-size",originalFontSize);
//			if (contentHolder.outerWidth(true) > contentWrapper.width()){
//				var newFontSize =  SpimeEngine.shrinkTextToFit(originalFontSize,contentWrapper,contentHolder,textElement,0,30);
//				textElement.css("font-size",newFontSize);
//			}
			
			
			
			var textElement = currentItem.find(".text-element");
			
			
			textElement.each(function(){
				var originalFontSize = parseInt($(this).attr("data-orig-font-size"));
				$(this).css("font-size",originalFontSize);
				var contentHolder = $(this).parent();
				if ($(this).outerWidth(true) > contentHolder.width()){
					//var newFontSize = stripes_arranger.shrinker(originalFontSize,currentItem,textElement);
					var newFontSize = SpimeEngine.shrinkTextToFit(originalFontSize,currentItem,$(this),$(this),0,30);
					$(this).css("font-size",newFontSize);
				}
			});
			
			
		}
	});

};

stripes_arranger.shrinker = function(fontSize,parent,content){
	if (content.outerWidth(true) > parent.width()){
		var shrinkedFontSize =  fontSize * 0.9 ;
		if (shrinkedFontSize < 15){
			return 15;
		}else{
			content.css("font-size",shrinkedFontSize);
			return stripes_arranger.shrinker(shrinkedFontSize,parent,content);
		}
	}else{
		return parseInt(content.css("font-size"));
	}
};

