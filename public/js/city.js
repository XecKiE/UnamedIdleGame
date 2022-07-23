import {Random} from './engine/engine.js'

const City = function() {
	let tiles = [];
	for(let i=0 ; i<100 ; i++) {
		tiles[i] = [];
		for(let j=0 ; j<100 ; j++) {
			tiles[i][j] = {
				land: 'grass',
				building: Random.i_rand(2) == 1 ? 'house' : Random.i_rand(2) == 1 ? 'tree'+Random.i_rand(4) : null,
				// building: Random.i_rand(2) == 1 ? 'house_top' : Random.i_rand(2) == 1 ? 'tree_top'+Random.i_rand(4) : null,
				tilt_x: Random.i_rand(21)-10,
				tilt_y: Random.i_rand(21)-10,
				// rotation: Random.f_rand(Math.PI*2)
			}
			// if(tiles[i][j].building == 'house_top') {
			// 	tiles[i][j].rotation = Random.i_rand(5)*Math.PI/2
			// }
		}
		console.log(Random.f_rand(Math.PI*2));
	}

	function render(engine, map) {
		let imin = Math.max(0, Math.floor(map.min_x(32)/64));
		let imax = Math.min(tiles.length, Math.ceil(map.max_x(32)/64));
		for(let i=imin ; i<imax ; i++) {
			let jmin = Math.max(0, Math.floor(map.min_y(32)/64));
			let jmax = Math.min(tiles[i].length, Math.ceil(map.max_y(32)/64));
			for(let j=jmin ; j<jmax ; j++) {
				let tile = tiles[i][j];
				engine.draw(tile.land, map.x(i*64), map.y(j*64), map.s(64), map.s(64));
				if(tile.building) {
					engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64-32+tile.tilt_y), map.s(64), map.s(96));
					// engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64+tile.tilt_y), map.s(64), map.s(64), tile.rotation);
				}
			}
		}
		
		// for(let i=imin ; i<imax ; i++) {
		// 	let jmin = Math.max(0, Math.floor(map.min_y(32)/64));
		// 	let jmax = Math.min(tiles[i].length, Math.ceil(map.max_y(32)/64));
		// 	for(let j=jmin ; j<jmax ; j++) {
		// 		let tile = tiles[i][j];
		// 		// engine.draw(tile.land, map.x(i*64), map.y(j*64), map.s(64), map.s(64));
		// 		if(tile.building) {
		// 			// engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64-32+tile.tilt_y), map.s(64), map.s(96), tile.rotation);
		// 			engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64+tile.tilt_y), map.s(64), map.s(64), tile.rotation);
		// 		}
		// 	}
		// }
		// console.log(, )
		// tiles.forEach((row, i) => row.forEach((tile, j) => {
		// 	// console.log(tile);
		// 	engine.draw(tile.land, map.x(i*64), map.y(j*64), map.s(64), map.s(64));
		// 	if(tile.building) {
		// 		engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64-32+tile.tilt_y), map.s(64), map.s(96));
		// 	}
		// }));
	}

	return {
		render: render,
	}
}

export default City;