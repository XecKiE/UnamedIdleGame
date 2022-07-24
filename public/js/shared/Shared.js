// Constantes Building
const CB = {
	PLACE:       1,
	road:       2,
	TAVERNE:     3,
	house:      4,
	AUTEL:       5,
	TEMPLE:      6,
	PANTHEON:    7,
	watchtower: 8,
	CASERNE:     9,
	MINAGE_FER:  1,
	MINAGE_BOIS: 1,
}

// Constantes Building inversées
const CBR = {};
for(let i in CB) {
	CBR[CB[i]] = i;
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
	needed.forEach(function(a) {
		if(!options.hasOwnProperty(a)) {
				return false;
		}
	})
	return true;
}
export const cb = CB;
export const cbr = CBR;


