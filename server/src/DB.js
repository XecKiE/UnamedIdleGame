
const conf = require(__dirname+'/Config.js');
console.log(conf.config.DB_USER);
console.log(conf.config.DB_PASSWORD);
const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host: 'xeck.fr', 
	port: 7013,
	user: conf.config.DB_USER, 
	password: conf.config.DB_PASSWORD,
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

exports.query = async (sql) => {
	let conn;
	try {
		conn = await pool.getConnection();
		var rows = await conn.query(sql);

	}
	catch (err) {
		console.log(err);
		return null;
	}
	finally {
		if (conn)
		{
			conn.release();
			return rows;
		}
	}
}