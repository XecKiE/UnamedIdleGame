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

server.listen(3000)

console.log('HTTP server has been started on :3000');


//Server WEBSOCKET


var ws = require('ws');
var db = require(__dirname+'/src/DB.js');
var parser = require(__dirname+'/src/Parser.js')

console.log('starting  WEBSOCKET server');
const wss = new ws.WebSocketServer({ port: 8081, clientTracking: true });

wss.on('connection', function connection(ws, req) {

  ws.on('message', async function message(data) {
    console.log(`Received message ${data}`, );
    ws.send(await parser.parse(data));
  });
});

console.log('WEBSOCKET server has been started on :8081');


