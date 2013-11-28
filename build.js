var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var sassify = require('./lib/sass-and-replace');
var assets = require('./lib/asset-parser');
var replaceExt = require('./lib/replace-ext');
var rimraf = require('rimraf');

function getAssetPath(src, root) {
	var filename = path.join(src);
	if (root) {
		filename = path.join(root, filename);
	}
	return filename;
}

function cssOutputFilename(outputRoot, src) {
	return replaceExt(getAssetPath(src, outputRoot), /scss|sass/i, 'css');
}

function buildDev(inputFile, outputRoot, appRoot) {
	var cssOutputFilenameAbsolute = cssOutputFilename.bind(null, outputRoot);

	/**
	 * Is passed the element.createStream() stream for each link element
	 *
	 * @param {Stream} stream
	 * @param {Object} data
	 */
	function cssTagHandler(stream, data) {
		var relPath = cssOutputFilename(null, data.src);
		stream.end('<link rel="stylesheet" type="text/css" href="' + relPath + '" />');
	}

	/**
	 * Does side effects to when link css tags are parsed
	 *
	 * @param {Array} data
	 */
	function cssFileHandler(data) {
		async.waterfall([
			assets.mapFileContents.bind(null, appRoot, null, data),
			assets.mapOutputFilename.bind(null, cssOutputFilenameAbsolute),
			assets.writeFiles.bind(null, null)
		], function(err, data) {
			console.log("Finished CSS Files");
		});
	};

	mkdirp.sync(outputRoot);
	var cssParser = assets.parse('link', 'href', cssFileHandler, cssTagHandler);
	var inputStream = fs.createReadStream(inputFile);
	var output = fs.createWriteStream(OUTPUT_ROOT + '/index.html')

	fs.createReadStream(inputFile)
		.pipe(cssParser)
		.pipe(output);

	console.log("BUILD STARTING");
	console.log("OUTPUT ROOT: %s", outputRoot);
}

var ENV         = process.argv[2];
var INPUT_FILE  = process.argv[3];
var APP_ROOT    = path.dirname(path.resolve(__dirname, INPUT_FILE));
var OUTPUT_ROOT = __dirname + '/build/' + ENV;

if (ENV == 'dev') {
	rimraf(OUTPUT_ROOT, function() {
		console.log("Removing directory %s", OUTPUT_ROOT);
		buildDev(INPUT_FILE, OUTPUT_ROOT, APP_ROOT);
	});
}
