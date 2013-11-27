var connect = require('connect');

function start(env) {
	var port = (env == 'prod') ? 80 : 8000;
	var root = __dirname + '/app/' + env;
	connect()
		.use(connect.static(__dirname + '/app'))
		.listen(port);
}

start(process.argv[2]);
