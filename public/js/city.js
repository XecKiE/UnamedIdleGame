import {Random, Mouse} from './engine/engine.js'
import Socket from './socket.js';
import {CB, CBR} from './shared/Shared.js'
import CityData from './shared/city_data.js';

const City = async function(_engine, _map, _city_id) {
	let engine = _engine;
	let map = _map;
	let city_id = _city_id;
	let tiles = [];

	let available_buildings = [
		'house',
		'watchtower',
		'iron_mine',
		'gold_mine',
		'wood_camp',
	];

	let selection = null;
	let clicked_tile = null;
	let options = {
		city_id: city_id
	};
	try {
		let city_info = await Socket.send('GET PLAYER_CITIES', options);
		console.log(city_info, city_id)
		var tiles_modified = [];
		city_info.tiles.forEach(function(data) {
			if (tiles_modified[data.x] === undefined) {
				tiles_modified[data.x] = [];
			}
			tiles_modified[data.x][data.y] = data;
		});
		console.log(tiles_modified);
	}
	catch (err) {
		console.log(err)
	}


	let city_data = CityData(city_id, tiles_modified);
	tiles = city_data.get_tiles();


	function render() {
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

		if(selection) {
			let pos = Mouse.position();
			let tile = coord_to_tile(map.screen_to_x(pos.x), map.screen_to_y(pos.y));
			engine.draw('focus', map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
			engine.draw_rect(map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
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

	function click(x, y, button) {
		if(selection) {
			console.log(x, y);
			selection.onclick(x, y, button);
		}
	}

	function coord_to_tile(x, y) {
		return {
			x: Math.floor((x+32)/64),
			y: Math.floor((y+32)/64),
		}
	}

	function select_building(dom, building) {
		if(dom.classList.contains('selected')) {
			dom.classList.remove('selected');
			map.set_frozen(false);
			selection = null;
		} else {
			document.querySelectorAll('.building').forEach((d) => d.classList.remove('selected'));
			dom.classList.add('selected');
			map.set_frozen(true);
			selection = {
				type: 'construct',
				value: building,
				onclick: async (x, y, button) => {
					if(button == 0) {
						if (CB.hasOwnProperty(building)) {
							try {
								let options = {
									city_id: city_id,
									type: CB[building],
									x: x,
									y: y,
									rotation: 0,
								};
								await Socket.send('BUILD', options);
								tiles[x][y].building = building;
							}
							catch (err) {
								console.log(err);	
							}
						}
						
						
					}
				},
			};
		}
	}
		

	function init() {
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
				t.addEventListener('click', () => select_building(t, building));
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

	return {
		render: render,
		init: init,
		deinit: deinit,
		click: click,
	}
}

export default City;