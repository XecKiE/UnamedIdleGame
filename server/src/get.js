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
				y: row.tyle_y,
				health: row.health
			};
			if (line.building_type_id) {
				line.b = row.building_type_id;
				line.b_l = row.building_level;
				line.b_r = row.building_rotation;
			}
			if (line.terrain_type_id) {
				line.t = row.terrain_type_id;
			}
			result.push(line);
		});
		return JSON.stringify(result);
	}
}