/**
 * Original here by Craig Buckler, Optimalworks.net:
 * http://www.sitepoint.com/blogs/2009/07/29/build-auto-expanding-textarea-1/
 *
 * License: "Please use as you wish at your own risk."
 */

(function() {
	// jQuery plugin definition
	$.fn.expander = function() {
		// resize a textarea
		function resize(e) {
			// event or initialize element?
			e = e.target || e;
			
			// find content length and box width
			var vlen = e.value.length, ewidth = e.offsetWidth;
			if (vlen != e.valLength || ewidth != e.boxWidth) {
				if (vlen < e.valLength || ewidth != e.boxWidth) e.style.height = "0px";
				var h = e.scrollHeight - 4;
				
				e.style.overflow = "hidden";
				e.style.height = h + "px";
				
				e.valLength = vlen;
				e.boxWidth = ewidth;
			}
			return true;
		};
		
		// initialize
		this.each(function() {
			// is a textarea?
			if (this.nodeName.toLowerCase() != "textarea") return;
			
			// initial resize
			resize(this);
			
			// zero vertical padding and add events
			$(this).bind("keyup", resize).bind("focus", resize);
		});

		return this;
	};

})();
