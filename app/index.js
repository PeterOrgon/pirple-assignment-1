// Dependencies
var http = require('http');
var https  = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config/config');

config.set().then(
  function(environmentSetup) {

    // HTTP server instance
    var httpServer = http.createServer(function(req, res) {
      unifiedServer(req, res);
    });

    // Start HTTP server
    httpServer.listen(environmentSetup.httpPort, function() {
      console.log('Server is listenting on ' + environmentSetup.httpPort );
    });

    // HTTPS server instance
    var httpsServer = https.createServer(environmentSetup.serverOptions, function(req, res) {
      unifiedServer(req, res);
    });

    // Start HTTPS server
    httpsServer.listen(environmentSetup.httpsPort, function() {
      console.log('Server is listenting on ' + environmentSetup.httpsPort );
    });

  },
  function(error) {
    console.log('Configuration failed!', error );
  }
);

// Server logic
var unifiedServer = function(req, res) {

    // Parse URL
    var parsedUrl = url.parse(req.url, true);

    // Get path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get query string as object
    var queryStringObject = parsedUrl.query;

    // Get HTTP method
    var method = req.method.toLowerCase();

    // Get headers as queryStringObject
    var headers = req.headers;

    // Get payload stream
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
      buffer += decoder.write(data);
    });
    req.on('end', function() {
      buffer += decoder.end();

      // Routing handler
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct data object for handler
      var data = {
        'trimmedPath': trimmedPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'headers': headers,
        'payload': buffer
      };

      // Route the request
      chosenHandler(data, function(statusCode, payload) {
        // Use the status code to call the handlers
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        // Use payload to call the handler
        payload = typeof(payload) == 'object' ? payload : {};
        // Convert payload
        var payloadString = JSON.stringify(payload);
        // Response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        // Log
        console.log('Response:',statusCode,payloadString);
      });
    });

};

// Handlers
var handlers = {};

handlers.hello = function(data, callback) {
  callback(200, {'message': 'Welcome!'});
};

handlers.notFound = function(data, callback) {
  callback(404);
};

// Request router
var router = {
  'hello': handlers.hello
};
