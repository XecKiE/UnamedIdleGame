// Constantes Building
const CB = {
	PLACE:       1,
	road:       2,
	TAVERNE:     3,
	house:      4,
	autel:       5,
	TEMPLE:      6,
	PANTHEON:    7,
	watchtower: 8,
	CASERNE:     9,
	iron_mine:  10,
	wood_camp: 11,
	gold_mine: 12,
}

// Constantes Building inversées
const CBR = {};
for(let i in CB) {
	CBR[CB[i]] = i;
}

//constante economy
const economyProduction = {
	iron_mine: {
		1: 10,
		2: 13,
		3: 17,
		4: 21,
		5: 25,

	},
	gold_mine: {
		1: 2,
		2: 4,
		3: 7,
		4: 10,
		5: 12,
	},
	wood_camp: {
		1: 10,
		2: 13,
		3: 17,
		4: 21,
		5: 25,
	},
}

// Constantes Terrain
const CT = {
	PLAINE: 1,
	DESERT: 2,
	EAU: 3,
}
// Constantes Terrain inversées
const CTR = {};
for(let i in CT) {
	CTR[CT[i]] = i;
}


export const checkOptions = (options, needed) => {
	let has = true;
	needed.forEach(function(a) {
		if(options.hasOwnProperty(a) === false) {
				has = false;
		}
	})
	return has;
}

export {
	CB,
	CBR,
	economyProduction,
}


