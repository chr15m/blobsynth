// http://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea

$(function() {
	$.fn.tabbable = function() {
		return this.each(function() {
			console.log($(this));
			$(this).bind('keydown', function(e) {
				var keyCode = e.keyCode || e.which;
				console.log(keyCode);
				
				if (keyCode == 9) {
					e.preventDefault();
					var start = $(this).get(0).selectionStart;
					var end = $(this).get(0).selectionEnd;

					// set textarea value to: text before caret + tab + text after caret
					$(this).val($(this).val().substring(0, start)
						+ "\t"
						+ $(this).val().substring(end));

					// put caret at right position again
					$(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
				}
			});
		});
	}
});
