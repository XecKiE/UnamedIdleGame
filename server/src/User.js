import * as db from './DB.js';
import { createHash } from 'crypto';

var users_listpardonmaisfautunnomdiffjecrois = {};
var uuid = 10;


const hash = password => createHash('sha256').update(password.toString()).digest('hex');


export class User {
	ws = null;
	
	constructor(ws) {
		uuid += 1;
		this.ws = ws;
		this.connected = false;
		this.uuid = uuid;
		users_listpardonmaisfautunnomdiffjecrois[uuid] = this;
		return uuid;
	}




	async connect(options) {
		if (options.user !== undefined && options.password !== undefined) {
			let password = hash(options.password);
			let exist = await db.query("SELECT * FROM users WHERE username = "+db.str(options.user)+" AND password = "+db.str(password)+"");
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

export async function register(options) {
	if (options.user !== undefined && options.password !== undefined) {
		let password = hash(options.password);
		let create_user = await db.query(`
			INSERT INTO users(username, password)
			VALUES (`+db.str(options.user)+`, `+db.str(password)+`)
		`)
		let create_city = await db.query(`
			INSERT INTO city(user_id, city_name, city_x, city_y)
			VALUES (${db.int(create_user.insertId)}, ${db.str(options.user+'\'s city')}, 1, 1)
		`)
		return true;
	}
	return false;
}

export const users_list = users_listpardonmaisfautunnomdiffjecrois;
