var db = require(__dirname+'/DB.js');
const { createHash } = require('crypto');

var users_list = {};
var uuid = 10;

exports.User = class User {
	ws = null;
	
	constructor(ws) {
		console.log(uuid);
		uuid += 1;
		console.log(uuid);
		this.ws = ws;
		this.connected = false;
		this.uuid = uuid;
		console.log(this.uuid)
		users_list[uuid] = this;
		return uuid;
	}

	async connect(options) {
		if (options.user !== undefined && options.password !== undefined) {
			let hash = createHash('sha256').update(options.password.toString()).digest('hex');
			console.log(hash);
			let exist = await db.query("SELECT * FROM users WHERE username = '"+options.user.toString()+"' AND password = '"+hash+"'");
			if (exist.length == 1) {
				this.connected = true;
				console.log(this.connected);
				this.user_id = exist[0].user_id;
				return true;
			}
		}
		return false;
	}
}

exports.users_list = users_list;
