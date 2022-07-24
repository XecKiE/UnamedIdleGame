import {Random, Noise} from './random.js';
import {CBR} from './Shared.js';

const CityData = function(seed, _tiles_modified) {
	let tiles_modified = _tiles_modified;

	let noise = new Noise(seed);
	// let rand = new Random(seed);


	function get_tile(i, j) {
		let land_noise = noise.int2D(i*.01, j*.01, 20);
		let land;
		if(land_noise < 5) {
			land = 'water';
		} else if(land_noise < 6) {
			land = 'desert';
		} else {
			land = 'grass';
		}

		let forest_noise = noise.int2D(i*.01+.692, j*.01+.692, 20);
		let building = null;
		if(forest_noise < 5 && land == 'grass') {
			building = 'tree0';
		}

		if(tiles_modified[i] !== undefined && tiles_modified[i][j] !== undefined) {
			building = CBR[tiles_modified[i][j].b];
		}
		return {
			land:  land,
			building: building,
			// building: noise.int2D(i, j, 5) == 1 ? 'tree'+noise.int2D(i, j, 4) : null,
			// building: noise.int2D(i, j, 2) == 1 ? 'house' : noise.int2D(i, j, 2) == 1 ? 'tree'+noise.int2D(i, j, 4) : null,
			tilt_x: noise.int2D(i, j, 21)-10,
			tilt_y: noise.int2D(i, j, 21)-10,
			// rotation: rand.f_rand(Math.PI*2)
		};
	}
	function get_tiles() {
		let tiles = [];
		for(let i=0 ; i<127 ; i++) {
			tiles[i] = [];
			for(let j=0 ; j<127 ; j++) {
				tiles[i][j] = get_tile(i, j);
			}
		}
		return tiles;
	}

	return {
		get_tile: get_tile,
		get_tiles: get_tiles,
	}
}
export default CityData;