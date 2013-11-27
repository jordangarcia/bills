var _ = require('underscore');
var sass = require('node-sass');
var through = require('through');
var concat = require('concat-stream');

function toSass(opts) {
	var stream = through(function(data) {
		c.write(data);
	}, function() {
		c.end();
	});

	var c = concat(function(data) {
		sass.render(_.extend(opts || {}, {
			data: data.toString(),
			success: function(css) {
				stream.emit("data", css);
				stream.emit("end");
			},
			error: stream.emit.bind(stream, "error"),
		}));
	});

	return stream;
}

module.exports = toSass;
