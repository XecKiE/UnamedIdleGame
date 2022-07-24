/**
* Fichier principale qui lance le serveur.
* Le server HTTP d'abord, ensuite le websocket
*/


//Server HTTP

import finalhandler from 'finalhandler'
import http from 'http'
import serveStatic from 'serve-static'
import {WebSocketServer } from 'ws';

console.log('starting  HTTP server');
var serve = serveStatic('./public/', { index: ['index.html', 'index.htm'] })

var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})

server.listen(3000)

console.log('HTTP server has been started on :3000');


//Server WEBSOCKET
import Random from '../public/js/shared/random.js'
		var r = new Random(20);
		let res = [];
		for (var i = 0; i < 10; i++)
			res.push(r.nextRange(10, 50))
		console.log(res.join(' '))

		var digits = ['0ds', '1', 'ss2', '3', '4', '5cx', '6', '7ss', '8', '9'];
		res = [];
		for (var i = 0; i < 10; i++)
			res.push(r.choice(digits));
		console.log(res.join(' '))

import * as db from './src/DB.js';
import parser from './src/Parser.js';
import * as users from './src/User.js';


console.log('starting  WEBSOCKET server');
const wss = new WebSocketServer({ port: 8081, clientTracking: true });

wss.on('connection', function connection(ws, req) {
	var user = new users.User(ws);
	console.log(user.uuid);
	ws.on('message', async function message(data) {

		console.log(`Received message ${data} from ${user.uuid}`);
		let response = await parser(data, user.uuid);
		console.log(`reponse : ${response}`)
		ws.send(response);
	});

	ws.on('close', async function message(data) {
		console.log(`${user.uuid} has been disconected`)
		delete users.users_list[user.uuid];
	});
});

console.log('WEBSOCKET server has been started on :8081');


