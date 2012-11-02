/**
 * Module dependencies.
 */
var express = require('express');

/**
 * Express server.
 */
var app = express();

/**
 * Express routes.
 */
app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000, function() {
	console.log("Express server listening on port %d in %s mode", app.settings.port || 3000, app.settings.env);
});