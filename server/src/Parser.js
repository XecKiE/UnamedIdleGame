import * as build from './Buildings.js';
import * as users from './User.js';
import * as get from './Get.js';
import * as db from './DB.js';


const func_map = {
	'REGISTER': _register,
	'CONNECT': _checkConnection,
	'BUILD': build.construct,
	'UPDATE': build.update,
	'DESTRUCT': build.destruct,
	'TERRAFORM': build.construct,
	'GET': {
		'CITY_TILE': get.cityTyle,
		'PLAYER_CITIES': get.playerCities,
		'CITY_RESSOURCE': get.cityRessource
	},

};

async function _register(options) {
	users.register(options)
};

async function _checkConnection(options) {
	console.log(options);
	let user = users.users_list[options.user_id];
	// if (user.connected == false) {
		if (await users.users_list[options.user_id].connect(options)) {
			let row = await db.query(`
				SELECT city_id
				FROM cities
				JOIN users USING(user_id)
				WHERE user_id = ${db.int(users.users_list[options.user_id].user_id)} LIMIT 1
			`);
			return {data: {success: true, data: 'user_connected', city_id: row[0].city_id, session_id: users.users_list[options.user_id].session_id}};
		}
		else {
			return {success: false, error: 'user login/password invalid'};
		}
	// }
	// else {
	// 	return {success: false, error: 'user is already connected'};
	// }
};

export default async (socket_data, user_uuid) => {
	var data = JSON.parse(socket_data);
	var user = users.users_list[user_uuid];
	let response = {
		idr: data.id,
		data: null
	};
	if (user.connected == false && data.action != 'CONNECT' && data.action != 'REGISTER') {
		response.error = 'user is not connected';
		return JSON.stringify(response);
	}

	var data = JSON.parse(socket_data);

	console.log(data.action.split(' '));
	try {
		data.options.user_id = user_uuid;
		console.log(data)
		var ret = await data.action.split(' ').reduce((a, b) => a[b], func_map)(data.options);
		console.log(ret);
		if (ret.error) {
			response.error = ret; 
		}
		else {
			response.data = ret.data;
		}
		return JSON.stringify(response);
	}
	catch (err) {
		console.log(err);
		response.error = data.action+' does not exist'
		return JSON.stringify(response);
	}

	return 
};