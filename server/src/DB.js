import conf from './Config.js';
import mariadb from 'mariadb';
import * as D from './D.js';


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
		D.init("DB connected - id is " + conn.threadId);
		conn.release(); //release to pool
	})
	.catch(err => {
		D.init_error("not connected due to error: " + err);
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
		D.init_error('DB query failed');
		D.init_error(err);
		return [];
	}

}

export const str = (str) => pool.escape(str);
export const int = (int) => {let a = parseInt(int); return isNaN(a) ? 0 : a};
export const float = (float) => {let a = parseFloat(float); return isNaN(a) ? 0 : a};