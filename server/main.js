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


var ws = require('ws');
var db = require(__dirname+'/src/DB.js');
var parser = require(__dirname+'/src/Parser.js')

console.log('starting  WEBSOCKET server');
const wss = new ws.WebSocketServer({ port: 8081, clientTracking: true });

wss.on('connection', function connection(ws, req) {

  ws.on('message', async function message(data) {
    console.log(`Received message ${data}`, );
    parser.parse(data);
  });
  ws.send('something');
});

console.log('WEBSOCKET server has been started on :8081');


/*
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'xeck.fr', 
     port: 7013,
     user:'pepite', 
     password: 'thomasestunepepite!',
     connectionLimit: 5,
     acquireTimeout: 1500,
});
pool.getConnection().then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.release(); //release to pool
    })
    .catch(err => {
      console.log("not connected due to error: " + err);
    });
async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("SELECT 1 as val");
	rows.forEach(function(row) {
		console.log(row.val);
	});
	//console.log(rows); //[ {val: 1}, meta: ... ]
	//const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	//console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.release();
  }
}*/
