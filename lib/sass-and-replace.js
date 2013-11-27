var fs = require('fs');
var path = require('path');
var trumpet = require('trumpet');
var toSass = require('./sass-stream');

function sassAndReplace(outputRoot, appRoot) {
	function replaceScript(el) {
		var stream = el.createStream({outer: true});
		el.getAttribute('src', function(src) {
			var sassFile = path.join(appRoot, src);
			var filename = path.basename(src).replace(path.extname(src), '');
			var outputPath = outputRoot + '/css/' + filename + '.css';
			var sassOpts = {
				includePaths: [path.dirname(sassFile)]
			};

			stream.end('<link rel="stylesheet" href="/' + path.relative(outputRoot, outputPath) + '">');

			fs.createReadStream(sassFile)
				.pipe(toSass(sassOpts))
				.pipe(fs.createWriteStream(outputPath));
		});
	}

	var tr = trumpet();
	tr.selectAll('script[type="text/sass"]', replaceScript);
	return tr;
}

module.exports = sassAndReplace;
