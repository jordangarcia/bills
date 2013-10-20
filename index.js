var connect = require('connect');

connect()
  .use(connect.static(__dirname + '/app'))
  .listen(8001);
