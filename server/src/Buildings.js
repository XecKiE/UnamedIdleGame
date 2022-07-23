var db = require(__dirname+'/DB.js');
const building_type = {
	PLACE: 1,
	ROUTE: 2,
	TAVERNE: 3,
	MAISON: 4,
	AUTEL: 5,
	TEMPLE: 6,
	PANTHEON: 7,
	POSTE_GARDE: 8,
	CASERNE: 9,
	MINAGE_FER: 10,
	MINAGE_BOIS: 11,
};

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

	//construction
	if (options.building_id == 0)
	{
		if (_checkOptions(options, ['city_id', 'building_type', 'building_pos_x', 'building_pos_y']) && building_type.hasOwnProperty(options.building_type)) {

			let data = await db.query(`
				INSERT INTO buildings(city_id, building_type_id, building_level, building_pos_x, building_pos_y)
				VALUES (${parseInt(options.city_id)}, ${building_type[options.building_type]}, 1, ${parseInt(options.building_pos_x)}, ${parseInt(options.building_pos_y)})
			`);

			if (data.affectedRows == 1) {
				console.log(`Je construit une ${options.building_type}`);
				var response = {
					status: 'success',
					type: 'building_build',
					options: {
						'building_id': data.insertId.toString(),
					},
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
	}
	//upgrade
	else {
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
	}
};

exports.destruct = async (options) => {
}