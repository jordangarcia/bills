var _ = require('underscore');
var fs = require('fs');
var stream = require('stream');
var path = require('path');
var trumpet = require('trumpet');
var through = require('through');
var concat = require('concat-stream');

var DEFAULTS = {
	minify: false
};

function linkTag(src) {
	return '<link rel="stylesheet" href="/' + src + '">';
}

function concatCss(outputRoot, appRoot, opts) {
	opts = _.extend(opts || {}, DEFAULTS);
	var tr = trumpet();
	var outputFileRel = '/css/style.css';
	var output = fs.createWriteStream(path.join(outputRoot, outputFileRel));
	var fileLookup = through();
	fileLookup.on('data', function(filename) {
		console.log('concatting %s', filename);
		fs.createReadStream(filename.toString())
			.on('data', function(data) {
				fileLookup.emit('data', data);
			});
	});
	var parseStream = through(function(write) {
		console.log(write);
	});

	fileLookup.pipe(parseStream).pipe(output);

	tr.selectAll('link[rel="stylesheet"]', function(el) {
		var stream = el.createStream({ outer: true });
		el.getAttribute('href', function(src) {
			console.log(path.join(appRoot, src));
			fileLookup.write(path.join(appRoot, src));
			stream.end('');
		});
	});

	// Add link tag to new stylesheet
	var headStream = tr.select('head').createStream();
	headStream.pipe(concat(function(data) {
		headStream.write(data);
		headStream.write(linkTag(outputFileRel))
	}));

	return tr;
}

module.exports = concatCss;
