/* All of the user interface code goes in here. */

// Detect which type of click event to use
// fallback to mouse click
var clickevent = "mousedown";
var moveevent = "mousemove";
var endevent = "mouseup";
var desktop = false;

try {
        // if this works we have a touch device
        document.createEvent("TouchEvent");
        clickevent = "touchstart";
        moveevent = "touchmove";
        endevent = "touchend";
} catch (e) {
        // if we don't have native touch we might have the TUIO plugin
        for (var p in navigator.plugins) {
                if (navigator.plugins[p].description && navigator.plugins[p].description.toLowerCase().indexOf("tuio") != -1) {
                        clickevent = "touchstart";
                        moveevent = "touchmove";
                        endevent = "touchend";
                }
        }
}

// attach fun times to buttons etc.
$(function() {
	var templates = {};
	// fetch the 'blob' UI template
	$.get("templates/blob.html", function(data) {
		templates["blob"] = data;
	});
	
	// when they hit the plus button add a new blob
	$("#add-blob").bind(clickevent, function(ev) {
		$("#blobs").append(templates["blob"]);
		ev.preventDefault();
	});
	
	// UI for each blob
	
	// when they click the x it removes the blob
	$(".remove-blob").live(clickevent, function(ev) {
		if (confirm("Really remove this blob?")) {
			$(this).parent().remove();
		}
		ev.preventDefault();
	});
	
	// when they hit the audio switch turn it on and off
	$(".audio-switch").live(clickevent, function(ev) {
		if ($(this).hasClass("mute")) {
			$(this).removeClass("mute");
		} else {
			$(this).addClass("mute");
		}
		ev.preventDefault();
	});
});
