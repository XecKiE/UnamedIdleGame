import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';
import * as economy from './Economy.js';

export const updateCityArmy = async (options) => {
	let casernes = await db.query(`
		SELECT building_level
		FROM tiles
		WHERE city_id = ${db.int(options.city_id)}
			AND building_type_id = ${db.int(shared.CB['caserne'])}

	`);
	let time_reduction = 0;
	casernes.forEach(function (caserne) {
		time_reduction += shared.caserneTimeReduction[caserne.building_level];
	});
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
			ORDER BY unit_id ASC
		`);
	let now = Math.floor(Date.now() / 1000);
	let last_time_production = null;
	let finished_unit = [];
	let stop_check = false;
	lines.forEach(function (line) {
		if (stop_check === false) {
			let time_required = shared.unitTimeProduction[shared.UnitR[line.unit_type]] - time_reduction;
			if (last_time_production === null) {
				last_time_production = line.date_creation;
			}

			if (now > parseInt(last_time_production) + parseInt(time_required)) {
				last_time_production = parseInt(last_time_production) + parseInt(time_required);
				finished_unit.push(line.unit_id);
			}
			else {
				stop_check = true;
			}
		}
	});

	if (finished_unit.length > 0) {
		await db.query(`
			UPDATE units
			SET unit_status = 1
			WHERE unit_status = 0
				AND unit_id IN (${finished_unit.join(',')})
		`);
		await db.query(`
			DELETE FROM unit_queue
			WHERE unit_id IN (${finished_unit.join(',')})
		`);
	}
	return time_reduction;
}

export const recrutUnit = async (options) => {
	//je pense qu'il faut un building_id pour atacher une unit_queue a un building
	if (shared.checkOptions(options, ['city_id', 'unit_type'])) {

		let ressource = await economy.updateRessources({city_id:options.city_id});
		if (ressource !== false &&
			ressource.iq >= shared.UnitPrice[shared.UnitR[options.unit_type]].iron &&
			ressource.wq >= shared.UnitPrice[shared.UnitR[options.unit_type]].wood &&
			ressource.gq >= shared.UnitPrice[shared.UnitR[options.unit_type]].gold
		) {
			let ins_unit = await db.query(`
				INSERT INTO units(unit_type)
				VALUES(${db.int(options.unit_type)})
			`);
			if (ins_unit !== [] && ins_unit.affectedRows === 1) {
				ins_unit.insertId
				let city_info = await db.query(`
					SELECT army_id, ressource_id
					FROM cities
					WHERE city_id = ${db.int(options.city_id)}
				`);
				if (city_info.length == 1) {
					city_info = city_info[0];
					await db.query(`
						INSERT INTO armies_unit(army_id, unit_id)
						VALUES(${db.int(city_info.army_id)}, ${db.int(ins_unit.insertId)})
					`);
					await db.query(`
						UPDATE ressources
						SET
							iron_quantity = iron_quantity - ${shared.UnitPrice[shared.UnitR[options.unit_type]].iron},
							wood_quantity = wood_quantity - ${shared.UnitPrice[shared.UnitR[options.unit_type]].wood},
							gold_quantity = gold_quantity - ${shared.UnitPrice[shared.UnitR[options.unit_type]].gold}
						WHERE ressource_id = ${db.int(city_info.ressource_id)}
					`);
					return {
						data : {
							iq:(ressource.iq - shared.UnitPrice[shared.UnitR[options.unit_type]].iron),
							wq:(ressource.wq - shared.UnitPrice[shared.UnitR[options.unit_type]].wood),
							gq:(ressource.gq - shared.UnitPrice[shared.UnitR[options.unit_type]].gold),							
						}
					};
				}
			}
		}
		else {
			shared.UnitR[options.unit_type];
			return {error:'missing ressources'};
		}
	}
	return {error:'missing options'};
	
}