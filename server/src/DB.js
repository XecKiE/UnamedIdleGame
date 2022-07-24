
import conf from './Config.js';
import mariadb from 'mariadb';
// console.log(conf.config.DB_USER);
// console.log(conf.config.DB_PASSWORD);


const pool = mariadb.createPool({
	host: 'xeck.fr', 
	port: 7013,
	user: conf.DB_USER, 
	password: conf.DB_PASSWORD,
	database: 'untitled',
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

export const query = async (sql) => {
	let conn;
	try {
		conn = await pool.getConnection();
		var rows = await conn.query(sql);
		if (conn)
		{
			conn.release();
			return rows;
		}
	}
	catch (err) {
		conn.release();
		console.log(err);
		console.log('on returne null');
		return [];
	}

}