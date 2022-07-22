var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
console.log('starting server');
var serve = serveStatic('./public/', { index: ['index.html', 'index.htm'] })

// Create server
var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(3000)

console.log('server has been started');
console.log(__dirname);