import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';


//fonction facile sans gestion de l'economie
export const construct = async (options) => {

	console.log(shared.checkOptions(options, ['city_id', 'type', 'x', 'y', 'rotation']));
	if (shared.checkOptions(options, ['city_id', 'type', 'x', 'y', 'rotation']) && shared.cbr[options.type]) {

		let data = await db.query(`
			INSERT INTO tiles(city_id, tile_x, tile_y, building_type_id, building_level, building_rotation, health)
			VALUES (${parseInt(options.city_id)}, ${parseInt(options.x)}, ${parseInt(options.y)}, ${options.type}, 1, ${parseInt(options.rotation)}, 100)
		`);
		console.log('data:');
		console.log(data);
		console.log(data === null);

		if (data !== [] && data.affectedRows == 1) {
			console.log(`Je construit une ${options.type}`);
			return {data: 'success'};
		}
		else {
			return {error: 'unable to insert data'};
		}
		
	}
	else {
		return {error: 'build parameters are not valid'};
	}
};

export const update = async (options) => {
	
	if (shared.checkOptions(options, ['building_id'])) {
			let data = await db.query(`
				UPDATE buildings
				SET building_level = building_level + 1
				WHERE building_id = `+parseInt(options.building_id)+`
			`);
			if (data[0].affectedRows == 1) {
				console.log(`Jupdate ${options.building_id}`);
				return {data: 'success'};
			}
			else {
				return {error: 'unable to update data'};
			}
	}	
};

export const destruct = async (options) => {
}