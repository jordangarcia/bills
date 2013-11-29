var path = require('path');
var append = require('./trumpet-append');
var replaceExt = require('./replace-ext');

function renderLinkTag(src) {
	return '<link rel="stylesheet" type="text/css" href="' + src + '" />';
}

function renderScriptTag(src) {
	return '<script type="text/javascript" src="' + src + '"></script>';
}

/**
 * Appends a script tag at the end of the selector
 *
 * @param {String} selector
 * @param {String} src
 */
function appendStyle(selector, src) {
	return append(selector, renderLinkTag(src));
}

/**
 * Appends a script tag at the end of the selector
 *
 * @param {String} selector
 * @param {String} src
 */
function appendScript(selector, src) {
	return append(selector, renderScriptTag(src));
}

/**
 * Generates a css filename from a sass filename
 */
function cssOutputFilename(outputRoot, src) {
	if (outputRoot) {
		filepath = path.join(outputRoot, src);
	} else {
		filepath = path.join(src);
	}
	return replaceExt(filepath, /scss|sass/i, 'css');
}

exports.renderLinkTag = renderLinkTag;
exports.renderScriptTag = renderScriptTag;
exports.appendStyle = appendStyle;
exports.appendScript = appendScript;
exports.cssOutputFilename = cssOutputFilename;
