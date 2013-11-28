var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var sassify = require('./lib/sass-and-replace');
var concatCss = require('./lib/concat-css');
var assets = require('./lib/asset-parser');
var replaceExt = require('./lib/replace-ext');
var rimraf = require('rimraf');

function createOutputDir(dir, callback) {
	async.parallel([
		mkdirp.bind(null, dir),
		mkdirp.bind(null, dir + '/css'),
		mkdirp.bind(null, dir + '/js')
	], callback);
}

function getAssetPath(src, root) {
	var filename = path.join(src);
	if (root) {
		filename = path.join(root, filename);
	}
	return filename;
}

function buildDev(inputFile, outputRoot, appRoot) {
	function cssOutputFilename(outputRoot, src) {
		return replaceExt(getAssetPath(src, outputRoot), /scss|sass/i, 'css');
	}

	var cssOutputFilenameAbsolute = cssOutputFilename.bind(null, outputRoot);

	function cssTagHandler(el, data) {
		var relPath = cssOutputFilename(null, data.src);
		el.createStream({outer: true})
			.end('<link rel="stylesheet" type="text/css" href="' + relPath + '" />');
	}

	function cssFileHandler(data) {
		async.waterfall([
			assets.mapFileContents.bind(null, appRoot, null, data),
			assets.mapOutputFilename.bind(null, cssOutputFilenameAbsolute),
			assets.writeFiles.bind(null, null)
		], function(err, data) {
			console.log("Finished CSS Files");
		});
	};

	var cssParse = assets.parse('link', 'href', cssFileHandler, cssTagHandler);
	var inputStream = fs.createReadStream(inputFile);
	inputStream.pipe(cssParse);

	console.log("BUILD STARTING");
	console.log("OUTPUT ROOT: %s", outputRoot);
	//createOutputDir(outputRoot, function() {
		//fs.createReadStream(inputFile)
			//.pipe(sassify(outputRoot, appRoot))
			//.pipe(concatCss(outputRoot, appRoot))
			//.pipe(fs.createWriteStream(outputFile));
	//});
}

var ENV         = process.argv[2];
var INPUT_FILE  = process.argv[3];
var APP_ROOT    = path.dirname(path.resolve(__dirname, INPUT_FILE));
var OUTPUT_ROOT = __dirname + '/build/' + ENV;

if (ENV == 'dev') {
	rimraf(OUTPUT_ROOT, function() {
		buildDev(INPUT_FILE, OUTPUT_ROOT, APP_ROOT);
	});
}
