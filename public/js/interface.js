import {Random, Mouse} from './engine/main.js'
import Socket from './socket.js';
import {CB, CBR} from './shared/Shared.js'
import City from './city.js';

const Interface = async function(_engine, _map) {
	let engine = _engine;
	let map = _map;
	let city_list = [];
	let curent_city_id = null;
	let city_name = '';
	let ressources_qte = {};
	let ressources_prd = {};

	let available_buildings = [
		'house',
		'watchtower',
		'iron_mine',
		'gold_mine',
		'wood_camp',
		'autel',
	];

	let selection = null;
	let clicked_tile = null;
	let options = {
	};


	function render() {
		city_list[curent_city_id].render();
		if(selection && Mouse.has_mouse()) {
			let pos = Mouse.position();
			let tile = coord_to_tile(map.screen_to_x(pos.x), map.screen_to_y(pos.y));

			engine.draw('focus', map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
			// engine.draw_rect(map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
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
									city_id: curent_city_id,
									type: CB[building],
									x: x,
									y: y,
									rotation: 0,
								};
								await Socket.send('BUILD', options);
								//faire un setteur ?
								city_list[curent_city_id].tiles[x][y].building = building;

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

	function update_ressource() {
		document.querySelectorAll('.int_resources').forEach((dom) => {
			dom.innerHTML = '';
			['iron', 'gold', 'wood'].forEach((ressource) => {
				let t = document.createElement('div');
				t.classList.add('ressource');
				let tt = document.createElement('div');
				tt.classList.add('ressource_name');
				tt.innerText = ressource.toUpperCase()+' : '+ city_list[curent_city_id].ressources_qte[ressource];
				t.appendChild(tt);
				let ti = document.createElement('img');
				ti.classList.add('ressource_image');
				ti.src = 'img/sprites/'+ressource+'.png';
				t.appendChild(ti);
				dom.appendChild(t);
			});
		});
	}

	function update_cityName() {
		city_name = city_list[curent_city_id].city_name;
		document.querySelectorAll('.int_city').forEach((dom) => {
			dom.innerHTML = '';
			let t = document.createElement('div');
			t.classList.add('city_name');
			t.innerText = 'City : '+city_name+'';
			dom.appendChild(t);
		});
	}

	async function update_PlayerCities() {
		let cities_info = await Socket.send('GET PLAYER_CITIES', {});
		document.querySelectorAll('.cities').forEach((dom) => {
			dom.innerHTML = '';
			let t = document.createElement('div');
			cities_info.forEach(function(city) {
				let tt = document.createElement('div');
				tt.innerText = city.name;
				if (city.city_id == curent_city_id) {
					tt.classList.add('selected_city');
				}
				tt.addEventListener('click', () => select_city(city.city_id));
				t.appendChild(tt);

			});
			dom.appendChild(t);
		});
	}
	
	async function select_city(city_id) {
		if (city_list[city_id] === undefined) {
			let city = await City(engine, map, city_id);
			city.init();
			city_list[city_id] = city;
		}
		curent_city_id = city_id;
		update_ressource();
		update_cityName();
		update_PlayerCities();
	}

	async function init(city_id) {
		map.focus(64*64, 64*64, .5);


		// Initialise les inputs avec la map
		map.mousedown(mousedown);
		map.mouseup(mouseup);

		let city = await City(engine, map, city_id);
		city.init();
		city_list[city_id] = city;
		curent_city_id = city_id;

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
			});
		});
		// Initialise le menu de ressource
		update_ressource();
		update_cityName();
		update_PlayerCities();

		
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

export default Interface;