import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';

export const updateProduction = async (options) => {
	if (options.hasOwnProperty('city_id')) {
		let result = await db.query(`
			SELECT c.ressource_id AS rid, t.building_type_id AS bt, t.building_level AS bl
			FROM cities c
			JOIN tiles t
				ON t.city_id = c.city_id
				AND t.building_type_id IN (${shared.CB.iron_mine, shared.CB.gold_mine, shared.CB.wood_camp})
			WHERE c.city_id = ${db.int(options.city_id)}
		`);
		if (result.length > 0) {
			let production = {
				iron_mine: 0,
				gold_mine: 0,
				wood_camp: 0,
			};
			result.forEach(function(line) {
				production[shared.CBR[line.bt]] += economyProduction[shared.CBR[line.bt]];
			});

			await db.query(`
				UPDATE ressources
				SET iron_production = ${production.iron_mine},
					wood_production = ${production.wood_camp},
					gold_production = ${production.gold_mine}
				WHERE ressource_id = ${db.int(result.rid)}
			`);

		}
	}
	else if (options.hasOwnProperty('army_id')) {
		//si pillage caravane
	}
}

export const updateEconomy = async (options) => {
	if (options.hasOwnProperty('city_id')) {
		let result = await db.query(`
			SELECT r.*, UNIX_TIMESTAMP(r.last_calcul) as last_time_calcul
			FROM ressources r
			JOIN cities c
				ON c.city_id = ${db.int(options.city_id)}
				AND c.ressource_id = r.ressource_id
		`);
		if (result.length == 1) {
			result = result[0];
			let time = (Date.now() / 1000) - result.last_time_calcul;
			//time = time / 3600;
			//on met en minute pour debuguer
			time = time / 60;
			db.select(`
				UPDATE ressources
				SET
					iron_quantity = iron_quantity + ${result.iron_production * time},
					wood_quantity = wood_quantity + ${result.wood_production * time},
					gold_quantity = gold_quantity + ${result.gold_production * time}
				WHERE ressource_id = ${db.int(result.ressource_id)}
			`);

		}
	}
	else if (options.hasOwnProperty('army_id')) {

	}
}