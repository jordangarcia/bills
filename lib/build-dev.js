var ENV = 'dev';

var fs = require('fs.extra');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var parse = require('./asset-parser');
var build = require('./build-steps');
var rimraf = require('rimraf');
var tools = require('./build-tools');

/**
 * Is passed the element.createStream() stream for each link element
 *
 * @param {Stream} stream
 * @param {Object} data
 */
function cssRelativeTag(el, stream, data) {
	var contents = (data.env && data.prod !== ENV)
		? ''
		: tools.renderLinkTag(tools.cssOutputFilename(null, data.src));
	stream.end(contents);
}

/**
 * Is passed the element.createStream() stream for each script element
 *
 * @param {Stream} stream
 * @param {Object} data
 */
function scriptRelativeTag(el, stream, data) {
	var contents = (data.env && data.prod !== ENV)
		? ''
		: tools.renderScriptTag(path.join(data.src));
	stream.end(contents);
}

function doBuild(inputFile, appRoot, outputRoot) {
	/**
	 * Does side effects to when link css tags are parsed
	 *
	 * @param {Array} data
	 */
	function cssFileHandler(data) {
		async.waterfall([
			build.filterByEnv.bind(null, ENV, data),
			build.mapFileContents.bind(null, appRoot, null),
			build.mapOutputFilename.bind(null, tools.cssOutputFilename.bind(null, outputRoot)),
			build.writeFiles.bind(null, null)
		]);
	};

	/**
	 * Does side effects to when link css tags are parsed
	 *
	 * @param {Array} data
	 */
	function scriptFileHandler(data) {
		async.waterfall([
			build.filterByEnv.bind(null, ENV, data),
			build.mapFileContents.bind(null, appRoot, null),
			build.mapOutputFilename.bind(null, path.join.bind(null, outputRoot)),
			build.writeFiles.bind(null, null)
		]);
	};

	var cssParser = parse({
		selector: 'link',
		attrs: {
			env: 'data-env',
			src: 'href',
			type: 'type',
		},
		fileHandler: cssFileHandler,
		tagHandler: cssRelativeTag,
	});

	var scriptParser = parse({
		selector: 'script[src]',
		attrs: {
			env: 'data-env',
			src: 'src',
			type: 'type',
		},
		fileHandler: scriptFileHandler,
		tagHandler: scriptRelativeTag,
	});

	console.log("BUILD STARTING");
	console.log("OUTPUT ROOT: %s", outputRoot);

	rimraf(outputRoot, function() {
		console.log("Removing directory %s", outputRoot);

		mkdirp.sync(outputRoot);

		// Main HTML file pipeline
		fs.createReadStream(inputFile)
			.pipe(cssParser)
			.pipe(scriptParser)
			.pipe(fs.createWriteStream(outputRoot + '/index.html'));

		// copy views
		fs.copyRecursive(appRoot + '/views', outputRoot + '/views', function() { });
	});
}

module.exports = doBuild;
