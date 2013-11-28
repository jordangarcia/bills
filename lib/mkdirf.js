var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

function mkdirf(file, mode, callback) {
	var dirname = path.dirname(file)
	if (!fs.existsSync(dirname)) {
		mkdirp(dirname, mode, callback);
	} else {
		if (typeof mode === 'function' || mode === undefined) {
			callback = mode;
		}
		callback();
	}
}

module.exports = mkdirf;
