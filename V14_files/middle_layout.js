var middle_layout = {};

middle_layout.init = function(container,items){
	//var originalFontSize = Math.round(parseInt(items.find(".preview-title").css("font-size")));
	//items.find(".preview-title").attr("data-orig-font-size",originalFontSize);
	items.find(".image-cover").css("min-height","inherit");
};

middle_layout.applyLayout = function(container,items,paramsFromRealTime){
	items.find(".item-content , .item-preview").css("min-height","initial");
	//container.closest(".master.item-box").removeAttr("data-min-stripe-height");
	//var originalFontSize = parseInt(items.find(".preview-title").attr("data-orig-font-size"));
	//var shrinkPlease = true;
//	if (typeof paramsFromRealTime != "undefined" ){
//		if (typeof paramsFromRealTime.value != "undefined"){
//			originalFontSize = parseInt(paramsFromRealTime.value);
//			items.find(".preview-title").attr("data-orig-font-size",originalFontSize);
//			shrinkPlease = false;
//		}
//	}
//	if (shrinkPlease){
	//	items.find(".preview-title").css("font-size",originalFontSize);
		//var minFontSize = 9999;
		//items.each(function(){
		//	var itemDetails = $(this).find(".item-details");
		//	var stripe = itemDetails.closest(".item-wrapper");
		//	var textElement = $(this).find(".preview-title");
		//	minFontSize = Math.min(minFontSize,SpimeEngine.shrinkTextToFit(originalFontSize,stripe,itemDetails,textElement,0,30));
		//});
		items.each(function(){
			$(this).find(".helper-div").css("padding",$(this).css("padding"));
			$(this).find(".item-content, .item-preview").css("min-height","inherit");
			//$(this).find(".preview-title").css("font-size",minFontSize);
		});
//	}
};

