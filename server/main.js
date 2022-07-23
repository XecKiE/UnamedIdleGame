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
var parser = require(__dirname+'/src/Parser.js');
var users = require(__dirname+'/src/User.js');

console.log('starting  WEBSOCKET server');
const wss = new ws.WebSocketServer({ port: 8081, clientTracking: true });

wss.on('connection', function connection(ws, req) {
	var user = new users.User(ws);
	console.log(user.uuid);
	ws.on('message', async function message(data) {

		console.log(`Received message ${data} from ${user.uuid}`);
		let response = await parser.parse(data, user.uuid);
		console.log(`reponse : ${response}`)
		ws.send(response);
	});

	ws.on('close', async function message(data) {
		console.log(`${user.uuid} has been disconected`)
		delete users.users_list[user.uuid];
	});
});

console.log('WEBSOCKET server has been started on :8081');


