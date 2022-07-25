import * as db from './DB.js';

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
			time = time / 3600;
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