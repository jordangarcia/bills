var connect = require('connect');

function start(env) {
	var port = (env == 'prod') ? 80 : 8000;
	var root = __dirname + '/build/' + env;
	connect()
		.use(connect.static(root))
		.listen(port);
}

start(process.argv[2]);
