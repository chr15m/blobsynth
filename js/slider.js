// turns an input element into a slider graphic
$(function() {
	$.fn.slider = function(callback) {
		return this.each(function() {
			var val = parseFloat($(this).val());
			var got = null;
			var me = $(this);
			var handle = $("<div class='slider-handle'></div>");
			me.after($("<div class='slider'></div>").append(handle));
			var w = me.offset().width - handle.offset().width;
			me.hide();
			
			function pixel_pos(v) {
				return v * w;
			}
			
			function set_val(nval) {
				val = Math.max(0, Math.min(nval, 1));
				if (callback) {
					callback(me.attr("name"), val);
				}
				handle.css("left", pixel_pos(val) + "px");
			}	
			
			// TODO: arrow keys jog the slider back and forth
			//$(this).bind("keyup", function(ev) {
			//	console.log(ev.keyCode);
			//});
			
			// dragging around
			handle.bind("mousedown touchstart", function(ev) {
				got = {"pageX": ev.pageX, "pos": pixel_pos(val)};
				ev.preventDefault();
			});
			
			$(document).bind("mousemove touchmove", function(ev) {
				if (got) {
					set_val((got.pos + (ev.pageX - got.pageX)) / w);
					ev.preventDefault();
				}
			});
			
			$(document).bind("mouseup touchend", function(ev) {
				got = null;
			});
			
			// initial callback to kick it off
			set_val(val);
		});
	}
});
