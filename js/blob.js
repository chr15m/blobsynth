/*
	a blob consists of an oscillator wave and a volume shaping envelope
	
	{
		"bpm": 180,
		"blobs": [
			{
				"wave": "sin(t)",		// oscillator formula
				"envelope-length": 1,		// length of the envelope
				"volume-envelope": "sin(t)",	// volume envelope formula
				"sequence": [60, 60, null, 62],	// note sequence for this blob
				"restart": false,		// whether or not to restart on note
				"on": false,			// is this blob currently switched on?
			},
		],
	}
*/

var blobdata = null;

var BlobEngine = {
	"update": function(data) {
	},
	"process": function(t) {
	}
};

// launch everything
$(function() {
	// test audio output
	var k, v, t = 0;
	/*
	var sink = Sink(function(buffer, channelCount) {
		for (var j=0; j<buffer.length; j+=2, t++) {
			v = Math.sin(k*t);
			buffer[j] = v;
			buffer[j+1] = v;
		}
	}, 2);
	k = 2 * Math.PI * 440 / sink.sampleRate;
	*/
	
	// test evaluating an expression
	var expr = Parser.parse("2 * sin(t) + 1");
	$("#show").html(expr.evaluate({"t": 2}));
});
