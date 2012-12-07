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
	var templates = {"blob": null, "rtfm": null};
	for (var t in templates) {
		var fetcher = function (name) {
			// fetch the 'blob' and 'help' UI templates
			$.get("templates/" + name + ".html", function(data) {
				templates[name] = data;
			});
		}(t);
	}
	
	// when they hit the plus button add a new blob
	$("#add-blob").bind(clickevent, function(ev) {
		var new_blob = $(templates["blob"]);
		$("#blobs").append(new_blob);
		new_blob[0].blob = blobengine.new_blob();
		new_blob.find("textarea").expander().tabbable();
		new_blob.find(".slider").slider(function(name, value){
			new_blob[0].blob.data[name] = value;
		}).next();
		ev.preventDefault();
		update_blob_equation(new_blob.find(".blob-equation"));
	});
	
	// when they hit the audio switch turn it on and off
	$("#audio-master").live(clickevent, function(ev) {
		if ($(this).hasClass("mute")) {
			blobengine.master(true);
		} else {
			blobengine.master(false);
		}
	});
	
	// when they change the BPM value - changes k rate
	$("input#bpm").live("change", function(ev) {
		blobengine.set_bpm(parseInt($(this).val()));
	});
	
	// set the initial value
	blobengine.set_bpm(parseInt($("input#bpm").val()));
	
	// mousing over the twitter stream will cause it to appear
	$("iframe.twitter-timeline").live("mouseover", function(ev) {
		this.original_bottom = $(this).css("bottom");
		$(this).animate({"bottom": "0px"});
	});
	
	// mousing out from the twitter stream will cause it to disappear
	$("iframe.twitter-timeline").live("mouseout", function(ev) {
		$(this).animate({"bottom": this.original_bottom});
	});
	
	/*** UI for each blob ***/
	
	// when they click the x it removes the blob
	$(".remove-blob").live(clickevent, function(ev) {
		var boss = $(this).parent();
		if (confirm("Really remove this blob?")) {
			// the blob will tell the blob engine to remove it
			boss[0].blob.remove();
			// remove the UI element too
			boss.remove();
		}
		ev.preventDefault();
	});
	
	// when they hit the audio switch turn it on and off
	$(".audio-switch").live(clickevent, function(ev) {
		var boss = $(this).parent();
		if ($(this).hasClass("mute")) {
			$(this).removeClass("mute");
			if (boss.hasClass("blob")) {
				boss[0].blob.on(true);
			}
		} else {
			$(this).addClass("mute");
			if (boss.hasClass("blob")) {
				boss[0].blob.on(false);
			}
		}
		ev.preventDefault();
	});
	
	// what happens when the help button is clicked
	$(".rtfm").live(clickevent, function(ev) {
		var rtfm = $("#rtfm");
		if (rtfm.length) {
			rtfm.show();
		} else {
			var rtfm = $("<div id='rtfm' class='box shadow'></div>").append(templates['rtfm']);
			$("#blobs").before(rtfm);
			var cb = $("<div id='rtfm-close'></div>").bind(clickevent, function(ev) {
				rtfm.hide();
			});
			rtfm.prepend(cb);
		}
	});
	
	// what happens when the tweet button is clicked
	$(".tweet.button").live(clickevent, function(ev) {
		// https://twitter.com/intent/tweet?button_hashtag=blobsynth&related=blobsynth&text=%e1%b8%82%5bexpression%5d
		var url = "https://twitter.com/intent/tweet?button_hashtag=blobsynth&related=blobsynth&text=" + encodeURI($(this).parent()[0].blob.data.wave) + "";
		var tw = window.open(url,"Blobsynth Tweet", "width=550,height=420,toolbar=no,titlebar=no,status=no,scrollbars=no,menubar=no,location=no");
	});
	
	// updates the equation of a blob
	function update_blob_equation(blob_input) {
		if ($(blob_input).parent()[0].blob.set_equation($(blob_input).val())) {
			$(blob_input).css("border-color", "");
		} else {
			$(blob_input).css("border-color", "red");
		};
	}
	
	// when they enter a new equation regenerate
	$(".blob textarea.blob-equation").live("change", function(ev) {
		update_blob_equation(this);
	});
});
