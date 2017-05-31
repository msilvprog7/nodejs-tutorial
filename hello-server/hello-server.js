// Code adapted from sample provided at https://nodejs.org/en/about/

// This is how you include modules,
// 'http' is a module in **node core**, meaning it's bundled with NodeJS,
// so no need to mess around with npm in this example.
var http = require('http');


// You can grab command line arguments from `process.argv` and
// use typical Javascript methods of handling the data
var hostname = '127.0.0.1',
    port = (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                ? Number(process.argv[2])
                : 80;


// Creating a server is made easy
// If you're not familiar with arrow function expression,
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#The_arrow_function_expression_(>)
var server = http.createServer((req, res) => {
    // Debug incoming requests
    console.log(`${req.method} ${req.url}`);

    // Send response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hello, world!' }));
});


// Don't forget to listen on the port
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
