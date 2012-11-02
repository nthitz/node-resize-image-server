# node-resize-image-server

  Web server with NodeJS thats only function is to resize images from the web

## What is it?
The route will resize the image specified by u (url) to the specified wxh dimensions. The dimensions are in pixels, not percent.

The image should be resized to fill the dimensions as much as possible, so cropping may be necessary. For example, if the image
is 200x800, and you want to resize to 100x100, the image would first be resized to 100x400, and then the height would be cropped
down to 100.

## Example
```js
http://localhost:3000/?w=800&h=600&u=http://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg
```

## Author

Philmod &lt;philippe.modard@gmail.com&gt;