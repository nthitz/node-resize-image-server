/**
 * Module dependencies.
 */
var fs = require('fs')
  , http_client = require('http')
  , url = require('url')
  , im = require('imagemagick')
  ;

/**
 * Expose object.
 */
var image = function(url,path) {
    this.url = url
  , this.path = null
  , this.filename = filename = this.url.split('/').slice(-1).toString()
  , this.dest = path + filename
  , this.w = null
  , this.h = null
  , this.resized = null;
  return this; // to chain
};
module.exports = image;


/**
 * Check if the image exists in our directory
 *   - if exists: load
 *   - otherwise: download
 *
 * @param {opt} options with url and file destination
 * @callback callback(err,file)
 * @api public
 */
image.prototype.load = function(callback) {
  var that = this;
	fs.exists(this.dest, function(exists) {
		if (exists) { // no need to download
      that.getSize(callback);
		}
		else { // download
			that.getImg(function(err,res) {
        that.getSize(callback);
      });
		}
	});
}

/**
 * Get the image from URL
 *
 * @callback callback(err,file)
 * @api public
 */
image.prototype.getImg = function(callback) {
  var that = this;
	var u = url.parse(this.url);

  var options = {
    host: u.hostname,
    port: 80,
    path: u.pathname
  };

  http_client.get(options, function(res) {
    res.setEncoding('binary')
    var imagedata = '';
    res.on('data', function(chunk){
      imagedata += chunk; 
    });
    res.on('end', function(){
      fs.writeFile(that.dest, imagedata, 'binary', function(err) {
        callback(err,that);
      });
    });
  }).on('error', function(err) {
    callback(err,that);
  });
}


/**
 * Get image size.
 *
 * @callback callback
 * @api public
 */
image.prototype.getSize = function(callback) {
  var that = this;
  im.identify(['-format', '%wx%h',this.dest], function(err,features) {
    if (err) return callback(err,that);
      that.w = features.width   // Original width
    , that.h = features.height; // Original height
    callback(null,that);
  })
  /*im.identify(this.dest, function(err, features){ // bug with this method: https://github.com/rsms/node-imagemagick/issues/65
    if (err) return callback(err,that);
      that.w = features.width   // Original width
    , that.h = features.height; // Original height
    callback(null,that);
  });*/
}


/**
 * Resize image.
 *
 * @param {Number} w
 * @param {Number} h
 * @callback callback(err,binary)
 * @api public
 */
image.prototype.resize = function(w,h,callback) {
  var that = this;
  var w_ratio = this.w/w
    , h_ratio = this.h/h;
  var ratio = w_ratio
    , crop_  = false; // crop boolean
  if (w_ratio !== h_ratio) {
    crop_ = true;
    ratio = Math.min(w_ratio,h_ratio);
  }

  var options = {
      srcPath : this.dest
    , width : this.w/ratio || 100
    , height : this.h/ratio || 100
  };
  im.resize(options, function(err, stdout, stderr) {
    if (!crop_) callback(err,stdout);
    else {
      that.resized = stdout;
      that.crop(w,h,callback);
    }     
  });
}

/**
 * Crop image
 *
 * @param {Number} w
 * @param {Number} h
 * @callback callback(err,binary)
 * @api public
 */
image.prototype.crop = function(w,h,callback) {
  var options = {
      srcData : this.resized
    , width : w || 100
    , height : h || 100
  };
  im.crop(options, function(err, stdout, stderr) {
    this.resized = stdout;
    callback(err,this);
  });
}