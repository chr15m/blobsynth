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

// allow console level access to the blob data
window.blobdata = {"blobs": []};

var BlobEngine = function(data) {
	var accum = 0;
	var blobs = data.blobs;
	var blobvol = 0;
	var on = false;
	
	// get the values of each blob at a particular point in time t
	this.process = function(t) {
		accum = 0;
		blobvol = (1 / blobs.length);
		for (var b=0; b<blobs.length; b++) {
			accum += (blobs[b].wave_function.evaluate({"t": t}) * blobvol) * on;
		}
		return accum;
	}
	
	// master audio switch
	this.master = function(onoff) {
		on = onoff;
	}
};

// launch everything
$(function() {
	// create the blob playing engine
	window.blobengine = new BlobEngine(blobdata);
	
	// universal sample stamp
	var t = 0;
	// register for the latest value
	var reg = null;
	// rate at which the thing moves
	var rate = 0;
	
	// use sink to stream the audio to the browser
	var sink = Sink(function(buffer, channelCount) {
		for (var j=0; j<buffer.length; j+=2, t++) {
			buffer[j] = buffer[j+1] = blobengine.process(t * rate);
		}
	}, 2);
	// k = 2 * Math.PI * 440 / sink.sampleRate;
	rate = (2 * Math.PI / sink.sampleRate)
	
	// test evaluating an expression
	//var expr = Parser.parse("2 * sin(t) + 1");
	// $("#show").html(expr.evaluate({"t": 2}));
	blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 440) * sin(tan(t)*pow(sin(t),10))")});
	// blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 880)")});
});
