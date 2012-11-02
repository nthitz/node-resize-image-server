/**
 * Module dependencies.
 */
var im = require('imagemagick')
	;

/**
 * Resize.
 */
exports.resize = function(img,w,h,callback) {
	im.identify(img, function(err, features){
	  if (err) return callback(err,null);
	  var originalW = features.width
	  	, originalH = features.height;
	  var w_ratio = originalW/w
	  	, h_ratio = originalH/h;
	  var ratio = w_ratio
	  	, crop_  = false;
	  if (w_ratio !== h_ratio) {
	  	crop_ = true;
	  	ratio = Math.min(w_ratio,h_ratio);
	  }

	  // resize
	  var options = {
    	srcPath : img
    , width : originalW/ratio || 100
    , height : originalH/ratio || 100
		};
		im.resize(options, function(err, stdout, stderr) {
			if (!crop_) callback(err,stdout);
			else {
				crop(stdout,w,h,callback);
			}			
		});
	});	
}

/**
 * Crop.
 */
var crop = function(img,w,h,callback) {
	var options = {
    	srcData : img
    , width : w || 100
    , height : h || 100
	};
	im.crop(options, function(err, stdout, stderr) {
		callback(err,stdout);
	});
}
