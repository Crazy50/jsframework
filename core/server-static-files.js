'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var parseurl = require('parseurl');

module.exports = function(request, response) {
  // TODO: headers

  var urlParts = parseurl(request);
  // TODO: using this cwd a lot
  var filePath = path.join(process.cwd(), decodeURI(urlParts.pathname));
  var stats;

  console.log('look for:', filePath);

  try {
    stats = fs.lstatSync(filePath);
  } catch(e) {
    console.log('some error:', e);
    response.writeHead(404);
    response.write('File not found');
    response.end();
    return;
  }

  if (stats.isFile()) {
    console.log('serve up', filePath);
    response.writeHead(200, {'content-type': mime.lookup(filePath)});

    var fileStream = fs.createReadStream(filePath);
    fileStream.pipe(response);
  } else {
    console.log('it just isnt a file');
    response.writeHead(404);
    response.write('File not found');
    response.end();
  }

};
