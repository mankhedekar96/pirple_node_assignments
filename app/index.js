/**
 *  Primary file for the API
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiating the server
var httpServer = http.createServer((req,res)=>{
    unifiesServer(req,res);
});

// Start the server
httpServer.listen(config.httpPort,()=>{
    console.log("The server is listening on httpPort "+config.httpPort);
})

// Instantiating the server
var httpsServerOptions ={
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
    unifiesServer(req,res);
});

// Start the server
httpsServer.listen(config.httpsPort,()=>{
    console.log("The server is listening on httpsPort "+config.httpsPort);
})

// All the logic for both http and https server
var unifiesServer =(req,res)=>{
    // Get the URL and parse it
    var parsedURL =  url.parse(req.url,true);

    // Get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+s/g,'');

    // Get the HTTP Method
    var method = req.method;

    // Get the qery string as an object
    var queryStringObject = parsedURL.query;

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',(data)=>{
        buffer += decoder.write(data);
    });
    req.on('end',()=>{
        buffer += decoder.end();
        // Route the request to the handler specified in router

        // Choose the handler this request should go to. If one is not found then choose the notFound handler.
        var chosenHandler = typeof(router[trimmedPath])!== 'undefined'? router[trimmedPath]:handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath':trimmedPath,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':buffer
        }

        chosenHandler(data,(statusCode,payload)=>{
            // Used the status code called back by the handler, or default statuscode
            statusCode = typeof(statusCode)=='number'?statusCode:200;

            // Used the payload called back by the handler, or default payload
            payload = typeof(payload)=='object'?payload:{};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path 
            console.log("Returning the response: ",statusCode,payloadString);
        });
    });
}

// Define the handlers
var handlers = {}

// Ping handler
handlers.ping = (data,callback)=>{
    callback(200)
}

// Not found handler
handlers.notFound = (data,callback) =>{
    callback(404);
}

// Define a request router
var router = {
    'ping':handlers.ping
}