var db = require(__dirname+'/DB.js');
var shared = require(process.cwd()+'/public/js/shared/Shared.js');


exports.exportModifiedCityTile = async (options) => {
	if(shared.checkOptions(options, ['city_id'])) {
		let rows = await db.query(`
			SELECT tile_x, tile_y, building_type_id, building_level, building_rotation, terrain_type_id,health
			FROM tiles
			WHERE city_id = ${parseInt(options.city_id)}
		`);
		let result = [];
		rows.forEach(function(row) {
			let line = {
				x: row.tile_x,
				y: row.tile_y,
				health: row.health
			};
			if (row.building_type_id) {
				line.b = row.building_type_id;
				line.b_l = row.building_level;
				line.b_r = row.building_rotation;
			}
			if (row.terrain_type_id) {
				line.t = row.terrain_type_id;
			}
			result.push(line);
		});
		return {data: result};
	}
}

exports.exportPlayerCity = async (options) => {

	if(shared.checkOptions(options, ['city_id'])) {
		let rows = await db.query(`
			SELECT city_id, city_x, city_y, city_name
			FROM city
			WHERE user_id = ${parseInt(options.user_id)}
		`);
		let result = [];
		rows.forEach(function(row) {
			let line = {
				city_id: row.city_id,
				x: row.city_x,
				y: row.city_y,
				name: row.city_name
			};

			result.push(line);
		});
		console.log(result);
		return {data: result};
	}
}

exports.exportCity = async (options) => {

}