/**
* Fichier principale qui lance le serveur.
* Le server HTTP d'abord, ensuite le websocket
*/


//Server HTTP

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

console.log('starting  HTTP server');
var serve = serveStatic('./public/', { index: ['index.html', 'index.htm'] })

var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})

server.listen(80)

console.log('HTTP server has been started on :80');


//Server WEBSOCKET
