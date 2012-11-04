/**
 * Module dependencies.
 */
var express = require('express')
	, fs = require('fs')
	, Img = require('./lib/image.js')
	;

/**
 * Options.
 */
var img_path = __dirname + '/img/';
if (!fs.existsSync(img_path)) {
	fs.mkdirSync(img_path);
}

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
		;

	var img = new Img(u,img_path).load(function(err,im) {
		if (err) {
			console.log('err 1 : ' + err);
			res.send(500, { error: err });
		}
		else {
			im.resize(w,h,function(err,im) {
				if (err) {
					console.log('err 2 : ' + err);
					res.send(500, { error: err });
				}
				else {
					res.writeHead(200, {"Content-Type": "image/png"});
      		res.end(im.resized, "binary");
				}
			})
		}
	});
});

/**
 * Start server.
 */
app.listen(3000, function() {
	console.log("Express server listening on port %d in %s mode", app.settings.port || 3000, app.settings.env);
});