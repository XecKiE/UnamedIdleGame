import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';
import * as D from './D.js';

export const updateProductions = async (options) => {
	if (options.hasOwnProperty('city_id')) {
		let result = await db.query(`
			SELECT c.ressource_id AS rid, t.building_type_id AS bt, t.building_level AS bl
			FROM cities c
			JOIN tiles t
				ON t.city_id = c.city_id
				AND t.building_type_id IN (${shared.CB.iron_mine}, ${shared.CB.gold_mine}, ${shared.CB.wood_camp})
			WHERE c.city_id = ${db.int(options.city_id)}
		`);

		if (result.length > 0) {
			let production = {
				iron_mine: 0,
				gold_mine: 0,
				wood_camp: 0,
			};
			result.forEach(function(line) {
				production[shared.CBR[line.bt]] += parseInt(shared.economyProduction[shared.CBR[line.bt]][line.bl]);
			
			});

			await db.query(`
				UPDATE ressources
				SET iron_production = ${db.int(production.iron_mine)},
					wood_production = ${db.int(production.wood_camp)},
					gold_production = ${db.int(production.gold_mine)}
				WHERE ressource_id = ${db.int(result[0].rid)}
			`);
		}
	}
	else if (options.hasOwnProperty('army_id')) {
		//si pillage caravane
	}
}

export const updateRessources = async (options) => {
	if (options.hasOwnProperty('city_id')) {
		let rows = await db.query(`
			SELECT r.*, UNIX_TIMESTAMP(r.last_calcul) as last_time_calcul
			FROM ressources r
			JOIN cities c
				ON c.city_id = ${db.int(options.city_id)}
				AND c.ressource_id = r.ressource_id
		`);

		if (rows.length == 1) {
			let line = rows[0];
			let time = parseInt(Date.now() / 1000) - parseInt(line.last_time_calcul);
			//time = time / 3600;
			//on met en minute pour debuguer
			time = time / 60;
			await db.query(`
				UPDATE ressources
				SET
					iron_quantity = iron_quantity + ${line.iron_production * time},
					wood_quantity = wood_quantity + ${line.wood_production * time},
					gold_quantity = gold_quantity + ${line.gold_production * time},
					last_calcul = NOW()
				WHERE ressource_id = ${db.int(line.ressource_id)}
			`);
			let result = {
				iq: line.iron_quantity + (line.iron_production * time),
				wq: line.wood_quantity + (line.wood_production * time),
				gq: line.gold_quantity + (line.gold_production * time),
			};

			return result;
		}
		return false;
	}
	else if (options.hasOwnProperty('army_id')) {

	}
}