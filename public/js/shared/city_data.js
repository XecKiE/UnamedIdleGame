import {Random, Noise} from './random.js';

const CityData = function(seed) {
	let tiles = [];

	let noise = new Noise(seed);
	// let rand = new Random(seed);


	function get_tile(i, j) {
		return {
			land: noise.int2D(i*.01, j*.01, 6) < 3 ? 'desert' : 'grass',
			building: null,
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