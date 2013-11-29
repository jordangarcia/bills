var trumpet = require('trumpet');
var concat = require('concat-stream');

function append(selector, contents) {
	var tr = trumpet();
	var stream = tr.select(selector).createStream();
	stream.pipe(concat(function(data) {
		stream.write(data);
		stream.write(contents);
		stream.end();
	}));

	return tr;
}

module.exports = append;
