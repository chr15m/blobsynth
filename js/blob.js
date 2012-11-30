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
	var accum = 0;
	var blobs = data.blobs;
	var blobvol = 0;
	var on = false;
	
	// get the values of each blob at a particular point in time t
	this.process = function(t) {
		accum = 0;
		blobvol = (1 / blobs.length);
		for (var b=0; b<blobs.length; b++) {
			accum += (blobs[b].wave_function.evaluate({"t": t}) * blobvol) * on * blobs[b].data.on;
		}
		return accum;
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
	// blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 440) * sin(tan(t)*pow(sin(t),10))")});
	// blobdata.blobs.push({"wave_function": Parser.parse("sin(t * 880)")});
});

// TODO: cro-bar Miller's mtof function into the parser
function mtof(f) {
	if (f <= -1500) {
		return 0;
	} else if (f > 1499) {
		return mtof(1499);
	} else {
		return (8.17579891564 * Math.exp(.0577622650 * f));
	}
}
