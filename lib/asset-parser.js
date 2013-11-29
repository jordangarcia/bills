var _ = require('underscore');
var trumpet = require('trumpet');
var concat = require('concat-stream');

function createParseHandler(attrsToGet, pipeline, callback) {
	return function(el) {
		// workaround for trumpet: must create element stream outside of
		// getAttribute callback
		var stream = el.createStream({outer:true})
		var attrs = {};
		var numAttrs = _.size(attrsToGet);

		// getAttribute() for a non existent attribute will
		// never call the supplied callback
		el._matcher.once('tag-end', function() {
			pipeline.write(attrs);
			callback(el, stream, attrs);
		});
		_.each(attrsToGet, function(attr, name) {
			el.getAttribute(attr, function(val) {
				attrs[name] = val;
			});
		});
	}
}

/**
 * [config.selector]
 * [config.attrs] map of attrs to get from element and pass to handlers
 * [config.fileHandler] function passed an array of extracted element attributes
 * [config.tagHandler] function passed the (el, stream, attrs)
 *
 * @param {Object} config
 */
function parseAssets(config) {
	var tr = trumpet();
	var stream = concat(function(data) {
		config.fileHandler(data);
	});

	tr.selectAll(config.selector, createParseHandler(config.attrs, stream, config.tagHandler));
	tr.on('end', function() {
		stream.end();
	});
	return tr;
}

module.exports = parseAssets;
