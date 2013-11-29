var connect = require('connect');
var fs = require('fs');
var path = require('path');

function start(env) {
	var port = (env == 'prod') ? 8000 : 8000;
	var root = __dirname + '/build/' + env;
	connect()
		.use(connect.static(root))
		.listen(port);
}

var env = process.argv[2];
start(env);
