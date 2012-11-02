/**
 * Module dependencies.
 */
var im = require('imagemagick')
	, fs = require('fs')
	, gm = require('gm')
	;

/**
 * Resize.
 */
/*exports.resize = function(img,w,h,callback) {
	console.log('%o',img);
	var options = {
    	srcPath : img
    , strip : false
    , width : w //|| 100
    , height : h || 100
	};
	im.resize(options, function(err, stdout, stderr) {
		if (err) console.log('erro : ' + err); //callback(err,null);
		else callback(err,stdout);
	});
}*/

exports.resize = function(img,w,h,callback) {
	var readStream = fs.createReadStream(img);
	gm(readStream, 'img2.jpg')
	  .resize('200', '200')
	  .stream(function (err, stdout, stderr) {
	  var writeStream = fs.createWriteStream('resized.jpg');
	  stdout.pipe(writeStream);
	});
}
