import * as db from './DB.js';
import * as shared from './../../public/js/shared/Shared.js';
import * as economy from './Economy.js';

export const updateCityArmy = async (options) => {

}

export const buildUnit = async (options) => {
	//je pense qu'il faut un building_id pour atacher une unit_queue a un building
	if (shared.checkOptions(options, ['city_id', 'unit_type'])) {
		let ressource = economy.updateRessources({city_id:options.city_id});
		if (ressource !== false &&
			ressource.iq >= shared.unitPrice[shared.Unit[options.unit_type]].iron &&
			ressource.wq >= shared.unitPrice[shared.Unit[options.unit_type]].wood &&
			ressource.gq >= shared.unitPrice[shared.Unit[options.unit_type]].gold
		) {
			let ins_unit = await db.query(`
				INSERT INTO units(unit_type)
				VALUES(${db.int(shared.Unit[options.unit_type])})
			`);
			if (ins_unit !== [] && ins_unit.affectedRows === 1) {
				ins_unit.insertId
				let city_info = await db.query(`
					SELECT army_id, ressource_id
					FROM cities
					WHERE city_id = ${db.int(options.city_id)}
				`);
				if (city_info.length == 1) {
					city_info = army_id[0];
					await db.query(`
						INSERT INTO armies_unit(army_id, unit_id)
						VALUES(${db.int(city_info.army_id)}, ${db.int(ins_unit.insertId)})
					`);
					await db.query(`
						UPDATE ressources
						SET
							iron_quantity = iron_quantity - ${shared.unitPrice[shared.Unit[options.unit_type]].iron},
							wood_quantity = wood_quantity - ${shared.unitPrice[shared.Unit[options.unit_type]].wood},
							gold_quantity = gold_quantity - ${shared.unitPrice[shared.Unit[options.unit_type]].gold},
						WHERE ressource_id = ${db.int(line.ressource_id)}
					`);
					return {
						iq:(ressource.iq - shared.unitPrice[shared.Unit[options.unit_type]].iron),
						wq:(ressource.wq - shared.unitPrice[shared.Unit[options.unit_type]].wood),
						gq:(ressource.gq - shared.unitPrice[shared.Unit[options.unit_type]].gold),
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