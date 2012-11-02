/**
 * Module dependencies.
 */
var fs = require('fs')
  , http_client = require('http')
  , url = require('url')
  ;


/**
 * Check if the image exists in our directory
 *   - if exists: load
 *   - otherwise: download
 *
 * @param {opt} options with url and file destination
 * @callback callback(err,file)
 * @api private
 */
exports.loadImg = function(opt, callback) {
	fs.exists(opt.dest, function(exists) {
		if (exists) { // no need to download
      /*fs.readFile(opt.dest, 'binary', function(err,data) {
        callback(err,data);
      });*/
      callback(null,opt.dest);
		}
		else { // download
			getImg(opt,callback);
		}
	})
}

/**
 * Get the image from URL
 *
 * @param {opt} options with url and file destination
 * @callback callback(err,file)
 * @api private
 */
var getImg = function(opt, callback) {
	var u = url.parse(opt.url);

  var options = {
    host: u.hostname,
    port: 80,
    path: u.pathname
  };

  http_client.get(options, function(res) {
    res.setEncoding('binary')
    var imagedata = ''
    res.on('data', function(chunk){
      imagedata+= chunk; 
    });
    res.on('end', function(){
      fs.writeFile(opt.dest, imagedata, 'binary', function(err) {
        // callback(err,imagedata);
        callback(err,opt.dest);
      });
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}
