var MIME_TYPE_CSS = 'text/css';
var MIME_TYPE_SASS = 'text/sass';

var _ = require('underscore');
var fs = require('fs');
var trumpet = require('trumpet');
var concat = require('concat-stream');
var async = require('async');
var path = require('path');
var sass = require('node-sass');
var mkdirp = require('mkdirp');

function createParseHandler(src, pipeline, callback) {
	return function(el) {
		// workaround for trumpet: must create element stream outside of
		// getAttribute callback
		var stream = el.createStream({outer:true})
		var attrs = {};

		function done() {
			if (attrs.type && attrs.src) {
				var data = {
					type: attrs.type,
					src: attrs.src,
				};
				pipeline.write(data);
				callback(stream, data);
			}
		}

		// since nesting el.getAttribute doesn't work
		el.getAttribute(src, function(val) {
			attrs.src = val;
			done();
		});
		el.getAttribute('type', function(type) {
			attrs.type = type;
			done();
		});
	}
}

function parseAssets(selector, srcAttr, callback, tagHandler) {
	var tr = trumpet();
	var stream = concat(function(data) {
		callback(data);
	});

	tr.selectAll(selector, createParseHandler(srcAttr, stream, tagHandler));
	tr.on('end', function() {
		stream.end();
	});
	return tr;
}

/**
 * Takes an array of objects {src: ..., type: ...} and returns
 * {src: ..., type: ..., contents: ...}
 *
 * @param {String} root directory
 * @param {Object} sassOpts
 * @param {Array} data
 * @param {Function} callback with (err, results)
 */
function mapFileContents(root, sassOpts, data, callback) {
	console.log("Mapping file contents to data");
	function iter(item, finish) {
		var filepath = path.join(root, item.src);
		if (item.type == MIME_TYPE_SASS) {
			console.log("Parsing SASS file contents for %s", filepath);
			sass.render(_.extend(sassOpts || {}, {
				file: filepath,
				success: function(css) {
					item.contents = css;
					item.type = MIME_TYPE_CSS;
					finish(null, item);
				},
				error: finish,
			}));
		} else if (item.type == MIME_TYPE_CSS) {
			console.log("Getting file contents for %s", filepath);
			fs.createReadStream(filepath)
				.pipe(concat(function(data) {
					item.contents = data.toString();
					finish(null, item);
				}));
		} else {
			finish("Invalid MIME_TYPE " + item.type);
		}
	}
	async.map(data, iter, callback);
}


/**
 * Adds a new property (outputFile) to each data structure
 *
 * @param {Function} generator passed the item.src as first and only arg
 * @param {Array} data
 * @param {Function} callback
 */
function mapOutputFilename(generator, data, callback) {
	console.log("Mapping output filenames");
	function iter(item, finish) {
		item.outputFile = generator(item.src);
		finish(null, item);
	}
	async.map(data, iter, callback);
}


/**
 * Iterates over data and writes the item.contents
 * to item.outputFile.  Will append for matching outputFile's
 *
 * @param {Object} opts
 * @param {Array} data
 * @param {Function} callback
 */
function writeFiles(opts, data, callback) {
	function write(item, finish) {
		var dirname = path.dirname(item.outputFile);
		if (!fs.existsSync(dirname)) {
			mkdirp.sync(dirname);
		}

		console.log("Writing %s to %s", item.src, item.outputFile);
		fs.appendFile(item.outputFile, item.contents, function() {
			finish(null, item);
		});
	}
	async.eachSeries(data, write, callback);
}

exports.parse = parseAssets;
exports.mapFileContents = mapFileContents;
exports.mapOutputFilename = mapOutputFilename;
exports.writeFiles = writeFiles;
