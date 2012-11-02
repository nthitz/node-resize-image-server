/**
 * Module dependencies.
 */
var express = require('express')
	, getImg  = require('./lib/getImg.js')
	, transfImg  = require('./lib/transfImg.js')
	, fs = require('fs')
	;

/**
 * Options.
 */
var img_path = __dirname + '\\img\\';

/**
 * Express server.
 */
var app = express();


/**
 * Express routes.
 */
app.get('/', function(req, res){
	var u = req.query.u // URL
		, w = req.query.w // width
		, h = req.query.h // height
		, filename = u.split('/').slice(-1).toString()
		;
	var options = {
			url: u
		, dest: img_path + filename
	}

	getImg.loadImg(options, function(err,image) {
		if (err) res.send(500);
		else {
			transfImg.resize(image,w,h,function(err,image) {
				if (err) res.send(500);
				else {
					res.writeHead(200, {"Content-Type": "image/png"});
      		res.end(image, "binary");
				}
			});
		}
	});

});


app.listen(3000, function() {
	console.log("Express server listening on port %d in %s mode", app.settings.port || 3000, app.settings.env);
});