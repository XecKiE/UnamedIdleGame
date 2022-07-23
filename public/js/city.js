import {Random} from './engine/engine.js'

const City = function() {
	let tiles = [];

	let available_buildings = [
		'house',
		'watchtower',
	];

	let selection = null;
	let clicked_tile = null;

	for(let i=0 ; i<127 ; i++) {
		tiles[i] = [];
		for(let j=0 ; j<127 ; j++) {
			tiles[i][j] = {
				land: i < 10 ? 'desert' : 'grass',
				building: Random.i_rand(5) == 1 ? 'tree'+Random.i_rand(4) : null,
				// building: Random.i_rand(2) == 1 ? 'house_top' : Random.i_rand(2) == 1 ? 'tree_top'+Random.i_rand(4) : null,
				tilt_x: Random.i_rand(21)-10,
				tilt_y: Random.i_rand(21)-10,
				// rotation: Random.f_rand(Math.PI*2)
			}
			// if(tiles[i][j].building == 'house_top') {
			// 	tiles[i][j].rotation = Random.i_rand(5)*Math.PI/2
			// }
		}
	}

	function render(engine, map) {
		// console.log(selection);
		let imin = Math.max(0, Math.floor(map.min_x(32)/64));
		let imax = Math.min(tiles.length, Math.ceil(map.max_x(32)/64));
		// Terrain
		for(let i=imin ; i<imax ; i++) {
			let jmin = Math.max(0, Math.floor(map.min_y(32)/64));
			let jmax = Math.min(tiles[i].length, Math.ceil(map.max_y(32)/64));
			for(let j=jmin ; j<jmax ; j++) {
				let tile = tiles[i][j];
				engine.draw(tile.land, map.x(i*64), map.y(j*64), map.s(64), map.s(64));
			}
		}
		// Entités
		for(let i=imin ; i<imax ; i++) {
			let jmin = Math.max(0, Math.floor(map.min_y(32)/64));
			let jmax = Math.min(tiles[i].length, Math.ceil(map.max_y(32)/64));
			for(let j=jmin ; j<jmax ; j++) {
				let tile = tiles[i][j];
				if(tile.building) {
					engine.draw(tile.building, map.x(i*64+tile.tilt_x), map.y(j*64-32+tile.tilt_y), map.s(64), map.s(96));
				}
			}
		}
	}

	function mousedown(x, y, button) {
		clicked_tile = coord_to_tile(x, y);
	}

	function mouseup(x, y, button) {
		let c = coord_to_tile(x, y);
		if(c.x == clicked_tile.x && c.y == clicked_tile.y) {
			click(c.x, c.y, button);
		}
		clicked_tile = null;
	}

	function clicked(x, y, button) {
		console.log(x, y);
	}

	function coord_to_tile(x, y) {
		return {
			x: Math.floor((x+32)/64),
			y: Math.floor((y+32)/64),
		}
	}
		

	function init(map) {
		map.focus(64*64, 64*64, .5);


		// Initialise les inputs avec la map
		map.mousedown(mousedown);
		map.mouseup(mouseup);

		// Initialise le menu de construction
		document.querySelectorAll('.int_construct').forEach((dom) => {
			dom.innerHTML = '';
			available_buildings.forEach((building) => {
				let t = document.createElement('div');
				t.classList.add('building');
				t.addEventListener('click', () => selection = {type: 'construct', value: building});
				let tt = document.createElement('div');
				tt.classList.add('building_name');
				tt.innerText = building.toUpperCase();
				t.appendChild(tt);
				let ti = document.createElement('img');
				ti.classList.add('building_image');
				ti.src = 'img/sprites/'+building+'.png';
				t.appendChild(ti);
				dom.appendChild(t);
				// ça c'est vachemnet plus lisible mais vu que j'ai accès à rien dans le contexte global je peux pas mettre de onclick. Une idée ?
				// dom.innerHTML += `
				// 	<div class="building">
				// 		<div class="building_name">${building.toUpperCase()}</div>
				// 		<img class="building_image" src="img/sprites/${building}.png"/>
				// 	</div>`;
			});
		});
	}

	function deinit(map) {
		// Dé-initialise les inputs avec la map
		map.remove_mousedown(mousedown);
		map.remove_mouseup(mouseup);
	}

	function click(x, y, button) {
		console.log(x, y, button);
	}

	return {
		render: render,
		init: init,
		deinit: deinit,
		click: click,
	}
}

export default City;