// allow console level access to the blob data
window.blobdata = {"blobs": []};

var Blob = function(owner) {
	this.data = {
		"on": false,
		"wave": ""
	};
	
	this.wave_function = {
		"evaluate": function() {
			return 0;
		}
	}
	
	this.remove = function() {
		owner.remove_blob(this);
	}
	
	this.set_equation = function (eq) {
		var fn = Parser.parse(eq);
		this.wave_function = fn;
		this.data.wave = eq;
	}
	
	this.on = function(x) {
		this.data.on = x;
	}
}

var BlobEngine = function(data) {
	var blobs = data.blobs;
	// volume multiplier for all blobs
	var blobvol = 0;
	// rate at which time moves (length in time of one sample)
	var rate = 0;
	// current sample
	var current_sample = 0;
	// whether or not the engine is currently on
	var on = false;
	// temporary accumulator
	var accum = 0;
	// reference to self
	var engine = this;
	
	// get the values of each blob at a particular point in time t
	this.process = function(buffer, channelCount) {
		if (on) {
			blobvol = (1 / blobs.length);
			for (var j=0; j<buffer.length; j+=2, current_sample++) {
				buffer[j] = buffer[j+1] = engine.process_at_time(current_sample * rate);
			}
		}
	}
	
	// process a single sample
	this.process_at_time = function(timestamp) {
		accum = 0;
		for (var b=0; b<blobs.length; b++) {
			accum += (blobs[b].wave_function.evaluate({"t": timestamp}) * blobvol) * on * blobs[b].data.on;
		}
		return accum;
	}
	
	// set the rate at which we will operate
	this.set_rate = function(sample_rate) {
		rate = 2 * Math.PI / sample_rate;
	}
	
	// master audio switch
	this.master = function(onoff) {
		on = onoff;
	}
	
	// add a new blob to our list of blobs
	this.new_blob = function() {
		var nb = new Blob(this);
		blobs.push(nb);
		return nb;
	}
	
	// remove a blob from our list of blobs
	this.remove_blob = function(blob) {
		blobs.splice(blobs.indexOf(blob), 1);
	}
};

// launch everything
$(function() {
	// create the blob playing engine
	window.blobengine = new BlobEngine(blobdata);
	
	// use sink to stream the audio to the browser
	var sink = Sink(blobengine.process, 2);
	blobengine.set_rate(sink.sampleRate);
	
	// test evaluating an expression
	//var expr = Parser.parse("2 * sin(t) + 1");
	// $("#show").html(expr.evaluate({"t": 2}));
	// blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 440) * sin(tan(t)*pow(sin(t),10))")});
	// blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 880)")});
});
