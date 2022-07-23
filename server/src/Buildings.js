var db = require(__dirname+'/DB.js');
var shared = require(process.cwd()+'/public/shared/Shared.js');

function _checkOptions(options, needed) {
	needed.forEach(function(a) {
		if(!options.hasOwnProperty(a)) {
				return false;
		}
	})
	return true;
}


//fonction facile sans gestion de l'economie
exports.construct = async (options) => {

	console.log(_checkOptions(options, ['city_id', 'type', 'x', 'y', 'rotation']));
	console.log(shared.building_type.hasOwnProperty(options.type));
	if (_checkOptions(options, ['city_id', 'type', 'x', 'y', 'rotation']) && shared.building_type.hasOwnProperty(options.type)) {

		let data = await db.query(`
			INSERT INTO tiles(city_id, tile_x, tile_y, building_type_id, building_level, building_rotation, health)
			VALUES (${parseInt(options.city_id)}, ${parseInt(options.x)}, ${parseInt(options.y)}, ${options.type}, 1, ${parseInt(options.rotation)}, 100)
		`);
		console.log('data:');
		console.log(data);
		console.log(data === null);
		if (data === null) {
			console.log('cest nul');
		}
		if (data !== null && data.affectedRows == 1) {
			console.log(`Je construit une ${options.type}`);
			var response = {
				status: 'success',
				type: 'building_build',
			};
			console.log(response);
			return response;
		}
		else {
			var response = {
				status: 'error',
				type: 'db_error',
				error: 'unable to insert data',
			};
			return response;
		}
		
	}
	else {
		var response = {
			status: 'error',
			type: 'options_error',
			error: 'build parameters are not valid',
		};
		return response;
	}
};

exports.update = async (options) => {
	
	if (_checkOptions(options, ['building_id'])) {
			let data = await db.query(`
				UPDATE buildings
				SET building_level = building_level + 1
				WHERE building_id = `+parseInt(options.building_id)+`
			`);
			if (data[0].affectedRows == 1) {
				console.log(`Jupdate ${options.building_id}`);
				var response = {
					status: 'success',
					type: 'building_update',
					options: {
						'building_id': options.building_id,
					},
				};
				return response;
			}
			else {
				var response = {
					status: 'error',
					type: 'db_error',
					error: 'unable to update data',
				};
				return response;
			}
	}	
};

exports.destruct = async (options) => {
}