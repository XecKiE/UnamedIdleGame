import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';
import * as D from './D.js';
import * as users from './User.js';
import * as economy from './Economy.js';
import * as armies from './Armies.js';

export const cityTyle = async (options) => {
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

export const playerCities = async (options) => {
	let where_sql = ``;

	let is_city_id = shared.checkOptions(options, ['city_id']);
	if(is_city_id === true) {
		where_sql = `c.city_id = ${db.int(options.city_id)}`;
	}
	else {
		where_sql = `c.user_id = ${db.int(users.users_list[options.user_id].user_id)}`
	}

		let rows = await db.query(`
			SELECT c.city_id, c.city_x, c.city_y, c.city_name,
				r.iron_quantity, r.wood_quantity, r.gold_quantity,
				r.iron_production, r.wood_production, r.gold_production
			FROM cities c
			JOIN ressources r
				ON r.ressource_id = c.ressource_id
			WHERE 1 AND 
			 ${where_sql}
		`);

		let result = [];
		rows.forEach(function(row) {
			let line = {
				city_id: row.city_id,
				x: row.city_x,
				y: row.city_y,
				name: row.city_name,
				iq: row.iron_quantity,
				wq: row.wood_quantity,
				gq: row.gold_quantity,
				ip: row.iron_production,
				wp: row.wood_production,
				gp: row.gold_production,
			};

			result.push(line);
		});
		if (is_city_id) {
			let tiles = await cityTyle(options);
			let ressource = await economy.updateRessources(options);
			result = result[0];
			result.tiles = tiles.data;
			result.iq = parseInt(ressource.iq);
			result.wq = parseInt(ressource.wq);
			result.gq = parseInt(ressource.gq);
		}
		
		return {data: result};
}


export const exportCity = async (options) => {

}

export const cityRessource = async (options) => {
	if(shared.checkOptions(options, ['city_id'])) {

	}
}

export const recrutList = async (options) => {
	if(shared.checkOptions(options, ['city_id'])) {
		let time_reduction = await armies.updateCityArmy(options);
		let lines = await db.query(`
			SELECT u.unit_id, u.unit_type, UNIX_TIMESTAMP(uq.date_creation) as date_creation
			FROM cities c
			JOIN armies_unit au
				ON au.army_id = c.army_id
			JOIN unit_queue uq
				ON uq.unit_id = au.unit_id
			JOIN units u
				ON u.unit_id = uq.unit_id
			WHERE c.city_id = ${db.int(options.city_id)}
		`);
		let data = {
			timeReduction: parseInt(time_reduction),
			recrutList: []
		}
		lines.forEach(function(line) {
			data.recrutList.push({
				unitId: line.unit_id,
				unitType: line.unit_type,
				dateQueue: parseInt(line.date_creation),
			});
		})

		return {data: data};
	}
	return {error: 'parametre manquant'};
}