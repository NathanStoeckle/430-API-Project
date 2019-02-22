const http = require('http'); // Pulls in the http module
const url = require('url'); // Pulls in the url module

// Parsing the url string
const query = require('querystring');

// Handlers
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Server
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// When the server gets a request...
const onRequest = (request, response) => {
  // parse url into individual parts and return those
  const parsedUrl = url.parse(request.url);

  // Use Switch Case to determine if it's GET, HEAD, or POST
  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsers(request, response);
      } else {
        jsonHandler.notReal(request, response);
      }
      break;
    case 'HEAD':
      if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsersMeta(request, response);
      } else {
        jsonHandler.notRealMeta(request, response);
      }
      break;
    case 'POST':
      if (parsedUrl.pathname === '/addUser') {
        const res = response;
        const body = [];

        // If there is an error with the upload stream, return a bad request
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        // On 'data' is for each byte of data that comes in
        //  from the upload. Add it to our byte array.
        request.on('data', (chunk) => {
          body.push(chunk);
        });

        // on end of upload stream.
        request.on('end', () => {
          
          // Combine the byte array by using Buffer.concat
          //  and convert it to a string value (in this instance)
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          // Pass it into our addUser function
          jsonHandler.addUser(request, res, bodyParams);
        });
      } 
      else {
        jsonHandler.notReal(request, response);
      }
      break;
    default:
      jsonHandler.notReal(request, response);
  }
};

// Create the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
