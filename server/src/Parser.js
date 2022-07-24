const build = require(__dirname+'/Buildings.js');
const users = require(__dirname+'/User.js');
const get = require(__dirname+'/Get.js');

const func_map = {
	'CONNECT': _checkConnection,
	'BUILD': build.construct,
	'UPDATE': build.update,
	'DESTRUCT': build.destruct,
	'TERRAFORM': build.construct,
	'GET': {
		'CITY_TILE': get.exportModifiedCityTile,
		'PLAYER_CITY': get.exportPlayerCity,
	},

};

async function _checkConnection(options) {
	console.log(options);
	let user = users.users_list[options.user_id];
	if (user.connected == false)
	{
		if (user.connected == false) {
			if (await users.users_list[options.user_id].connect(options)) {
				return {data: 'user_connected'};
			}
			else {
				return {error: 'user login/password invalid'};
			}
		}
		else {
			return {error: 'user is already connected'};
		}
	}
};

exports.parse = async (socket_data, user_uuid) => {
	var data = JSON.parse(socket_data);
	var user = users.users_list[user_uuid];
	let response = {
		idr: data.id,
		data: null
	};
	if (user.connected == false && data.action != 'CONNECT') {
		response.error = 'user is not connected';
		return JSON.stringify(response);
	}

	var data = JSON.parse(socket_data);

	console.log(data.action.split(' '));
	try {
		data.options.user_id = user_uuid;
		var ret = await data.action.split(' ').reduce((a, b) => a[b], func_map)(data.options);
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