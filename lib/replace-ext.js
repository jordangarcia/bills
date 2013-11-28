var path = require('path');

function replaceExt(filename, pattern, replace) {
	var ext = path.extname(filename);
	var dirname = path.dirname(filename)
	var basename = path.basename(filename, ext);
	if (pattern.test(ext)) {
		filename = dirname + '/' + basename + '.' + replace;
	}
	return filename;
}

module.exports = replaceExt;
