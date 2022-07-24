/**
* Fichier principale qui lance le serveur.
* Le server HTTP d'abord, ensuite le websocket
*/


//Server HTTP

import finalhandler from 'finalhandler'
import http from 'http'
import serveStatic from 'serve-static'
import {WebSocketServer } from 'ws';
import * as D from './src/D.js';

D.init('starting  HTTP server');
var serve = serveStatic('./public/', { index: ['index.html', 'index.htm'] })

var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})

server.listen(3000)

D.init('HTTP server has been started on :3000');


//Server WEBSOCKET
import * as db from './src/DB.js';
import parser from './src/Parser.js';
import * as users from './src/User.js';


D.init('starting  WEBSOCKET server');
const wss = new WebSocketServer({ port: 8081, clientTracking: true });

wss.on('connection', function connection(ws, req) {
	var user = new users.User(ws);
	D.ws(`WebSocket ouvert avec ${user.uuid}`);
	ws.on('message', async function message(data) {

		D.request(`Received message ${data} from ${user.uuid}`);
		let response = await parser(data, user.uuid);
		D.response(`reponse : ${response}`)
		ws.send(response);
	});

	ws.on('close', async function message(data) {
		D.ws(`WebSocket fermé avec ${user.uuid}`)
		delete users.users_list[user.uuid];
	});
});

D.init('WEBSOCKET server has been started on :8081');


