var ENV = 'prod';

var fs = require('fs.extra');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var parse = require('./asset-parser');
var build = require('./build-steps');
var replaceExt = require('./replace-ext');
var trumpetAppend = require('./trumpet-append');
var rimraf = require('rimraf');
var htmltidy = require('htmltidy');
var tools = require('./build-tools');

/**
 * Is passed the element.createStream() stream for each link element
 *
 * @param {Object} el
 * @param {Stream} stream
 * @param {Object} data
 */
function deleteTag(el, stream, data) {
	stream.end('');
}

function outputFile(file) {
	return function() {
		return file;
	}
}

function doBuild(inputFile, appRoot, outputRoot) {
	var CSS_FILENAME = '/style.css';
	var SCRIPT_FILENAME = '/script.js';

	/**
	 * Does side effects to when link css tags are parsed
	 *
	 * @param {Array} data
	 */
	function cssFileHandler(data) {
		async.waterfall([
			build.filterByEnv.bind(null, ENV, data),
			build.mapFileContents.bind(null, appRoot, null),
			build.mapOutputFilename.bind(null, outputFile(outputRoot + CSS_FILENAME)),
			build.mapGuessNoMinify,
			build.mapMinifyCss.bind(null, {}),
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
			build.mapOutputFilename.bind(null, outputFile(outputRoot + SCRIPT_FILENAME)),
			build.mapGuessNoMinify,
			build.mapUglifyJs.bind(null, null),
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
		tagHandler: deleteTag,
	});

	var scriptParser = parse({
		selector: 'script[src]',
		attrs: {
			env: 'data-env',
			src: 'src',
			type: 'type',
		},
		fileHandler: scriptFileHandler,
		tagHandler: deleteTag,
	});

	var tidy = htmltidy.createWorker({ indent: true });

	console.log("BUILD STARTING");
	console.log("OUTPUT ROOT: %s", outputRoot);

	rimraf(outputRoot, function() {
		console.log("Removing directory %s", outputRoot);

		mkdirp.sync(outputRoot);

		fs.createReadStream(inputFile)
			.pipe(cssParser)
			.pipe(scriptParser)
			.pipe(tools.appendStyle('head', CSS_FILENAME))
			.pipe(tools.appendScript('body', SCRIPT_FILENAME))
			.pipe(tidy)
			.pipe(fs.createWriteStream(outputRoot + '/index.html'));

		// copy views
		fs.copyRecursive(appRoot + '/views', outputRoot + '/views', function() { });
	});
}

module.exports = doBuild;
