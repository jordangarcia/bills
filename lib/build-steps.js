var MIME_TYPE_CSS = 'text/css';
var MIME_TYPE_SASS = 'text/sass';

var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');
var concat = require('concat-stream');
var async = require('async');
var sass = require('node-sass');
var CleanCss = require('clean-css');
var path = require('path');
var uglify = require('uglify-js');

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
		} else {
			console.log("Getting file contents for %s", filepath);
			fs.createReadStream(filepath)
				.pipe(concat(function(data) {
					item.contents = data.toString();
					finish(null, item);
				}));
		}
	}
	async.map(data, iter, callback);
}

/**
 * Filters results based on the item.env
 * if item.env is set and doesn't match `env` => remove
 *
 * @param {String} env to match
 * @param {Array} data
 * @param {Function} callback
 */
function filterByEnv(env, data, callback) {
	function iter(item, finish) {
		var truthy = !item.env || (item.env && item.env === env);
		finish(truthy);
	}
	async.filter(data, iter, function(results) {
		callback(null, results);
	});
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
 * Minifies item.contents css with supplied opts
 *
 * @param {Object} opts cleanCss config
 * @param {Array} data
 * @param {Function} callback
 */
function mapMinifyCss(opts, data, callback) {
	console.log("Minifying CSS");
	var clean = new CleanCss(opts);
	function iter(item, finish) {
		if (item.minify !== false) {
			item.contents = clean.minify(item.contents);
		}
		finish(null, item);
	}
	async.map(data, iter, callback);
}


/**
 * Inspects src filename if should minify
 *
 * @param {Array} data
 * @param {Function} callback
 */
function mapGuessNoMinify(data, callback) {
	function iter(item, finish) {
		item.minify = !/\.min/.test(item.src);
		finish(null, item);
	}
	async.map(data, iter, callback);
}

/**
 * Uglifies item.contents js with supplied opts
 *
 * @param {Object} opts cleanCss config
 * @param {Array} data
 * @param {Function} callback
 */
function mapUglifyJs(opts, data, callback) {
	console.log("Minifying JS");
	opts = _.extend(opts || {}, {
		fromString: true,
	});

	function iter(item, finish) {
		if (item.minify !== false) {
			item.contents = uglify.minify(item.contents, opts).code;
		}
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

exports.mapFileContents = mapFileContents;
exports.mapOutputFilename = mapOutputFilename;
exports.mapMinifyCss = mapMinifyCss;
exports.writeFiles = writeFiles;
exports.filterByEnv = filterByEnv;
exports.mapUglifyJs = mapUglifyJs;
exports.mapGuessNoMinify = mapGuessNoMinify;
