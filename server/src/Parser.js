const build = require(__dirname+'/Buildings.js');
const users = require(__dirname+'/User.js');
const get = require(__dirname+'/Get.js');

const func_map = {
	'BUILD': build.construct,
	'UPDATE': build.update,
	'DESTRUCT': build.destruct,
	'TERRAFORM': build.construct,
	'GET': {
		'CITY_TILE': get.exportModifiedCityTile,
		'PLAYER_CITY': get.exportPlayerCity,
	},

};

async function _checkConnection(data, user_uuid) {
	var user = users.users_list[user_uuid];
	if (user.connected == false)
	{
		if (user.connected == false) {
			if (await users.users_list[user_uuid].connect(data.options)) {
				var response = {
					status: 'success',
					data: 'user_connected',
					idr: data.id,
				};
				return response;
			}
			else {
				var response = {
					status: 'error',
					type: 'user_invalid_credentials',
					error: 'user login/password invalid',
					idr: data.id,
				};
				return response;
			}
		}
		else {
			var response = {
				status: 'error',
				type: 'user_already_connected',
				error: 'user is already connected',
				idr: data.id,
			};
			return response;
		}
	}
};

exports.parse = async (socket_data, user_uuid) => {
	//console.log(user);
	var data = JSON.parse(socket_data);
	var user = users.users_list[user_uuid];
	if (user.connected == false && data.action != 'CONNECT') {
		var response = {
			status: 'error',
			type: 'user_not_connected',
			error: 'user is not connected',
			idr: data.id,
		};
		return JSON.stringify(response);
	}
	else if (data.action == 'CONNECT')
	{
		let response = _checkConnection(data, user_uuid);
		response.idr = data.id;
		return JSON.stringify(response);
	}

	var data = JSON.parse(socket_data);
	console.log(data);
	console.log(data.action);
	console.log(data.action.split(' '));
	try {
		data.options.user_id = user.user_id;
		var response = await data.action.split(' ').reduce((a, b) => a[b], func_map)(data.options);
		return JSON.stringify({
			response: response,
			idr: data.id,
		});
	}
	catch (err) {
		console.log(err);
		var response = {
			status: 'error',
			type: 'func_error',
			error: data.action+' does not exist',
			idr: data.id,
		};
		return JSON.stringify(response);
	}

	return 
};