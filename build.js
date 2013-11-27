var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var sassify = require('./lib/sass-and-replace');

function createOutputDir(dir, callback) {
	async.parallel([
		mkdirp.bind(null, dir),
		mkdirp.bind(null, dir + '/css'),
		mkdirp.bind(null, dir + '/js')
	], callback);
}

function build(inputFile, outputRoot, appRoot) {
	var outputFile = outputRoot + '/index.html';
	createOutputDir(outputRoot, function() {
		fs.createReadStream(inputFile)
			.pipe(sassify(outputRoot, appRoot))
			.pipe(fs.createWriteStream(outputFile));
	});
}

var ENV         = process.argv[2];
var INPUT_FILE  = process.argv[3];
var APP_ROOT    = path.dirname(path.resolve(__dirname, INPUT_FILE));
var OUTPUT_ROOT = __dirname + '/build/' + ENV;

build(INPUT_FILE, OUTPUT_ROOT, APP_ROOT);
