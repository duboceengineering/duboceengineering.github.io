var footer_layout = {};

footer_layout.init = function(container,items){
	items.each(function(){
		var currentItem = $(this);
		var links = currentItem.find(".preview-item-links").children();
		links.css("clear","");
		links.each(function(idx){
			if (idx % 2 == 0 && idx!=0){
				$(this).css("clear","left");
			}
		});
	});
	
};

footer_layout.applyLayout = function(container,items){
	items.each(function(){
		var currentItem = $(this);
		var stripe = container.closest(".master.item-box");
		var rightDivWidth = currentItem.find(".preview-social-wrapper").width();
		var leftDivWidth = currentItem.find(".helper-div").width();
		var centerDivWidth = currentItem.find(".preview-item-links").innerWidth();
		var stripeWidth = stripe.width();
		if (rightDivWidth + leftDivWidth + centerDivWidth > stripeWidth){
			footer_layout.flipVertically(currentItem);
		}else{
			footer_layout.unflip(currentItem);
		}
	});
};

footer_layout.flipVertically = function(item){	
	if (typeof item.attr("data-flipped") == "undefined"){
		item.attr("data-flipped","true");
		var rightDiv = item.find(".right-div");
		var leftDiv = item.find(".left-div");
		var centerDiv = item.find(".center-div");
		rightDiv.addClass("flipped");
		leftDiv.addClass("flipped");
		centerDiv.addClass("flipped");
	}
};

footer_layout.unflip = function(item){
	if (typeof item.attr("data-flipped") != "undefined"){
		item.removeAttr("data-flipped","true");
		var rightDiv = item.find(".right-div");
		var leftDiv = item.find(".left-div");
		var centerDiv = item.find(".center-div");
		rightDiv.removeClass("flipped");
		leftDiv.removeClass("flipped");
		centerDiv.removeClass("flipped");
	}
};
