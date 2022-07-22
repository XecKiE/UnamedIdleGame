

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

exports.query = async (sql) => {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query(sql);
	rows.forEach(function(row) {
		console.log(row.val);
	});
	//console.log(rows); //[ {val: 1}, meta: ... ]
	//const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	//console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
  	console.log(err);
	return null;
  } finally {
	if (conn) {
		console.log(rows);
		conn.release();
		return rows;
	}
  }
}