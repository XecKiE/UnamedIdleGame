import {Random, Mouse} from './engine/main.js'
import Socket from './socket.js';
import {Unit} from './shared/Shared.js'
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
		'caserne',
	];

	let selection = null;
	let clicked_tile = null;
	let options = {
	};


	function render() {
		if(city_list[curent_city_id]) {
			city_list[curent_city_id].render();
			if(selection && Mouse.has_mouse()) {
				let pos = Mouse.position();
				let tile = coord_to_tile(map.screen_to_x(pos.x), map.screen_to_y(pos.y));

				engine.draw('focus', map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
				// engine.draw_rect(map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
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

	function click(x, y, button) {
		if(selection) {
			selection.onclick(x, y, button);
		}
		city_list[curent_city_id].click(x, y, button);
	}

	function coord_to_tile(x, y) {
		return {
			x: Math.floor((x+32)/64),
			y: Math.floor((y+32)/64),
		}
	}

	function show_recrutement() {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			let head = document.createElement('div');
			head.innerText = 'Recrutement des troupes';
			head.classList.add('floating_header');

			let close = document.createElement('div');
			close.classList.add('close_floating');
			close.innerText = 'X';
			close.addEventListener('click', function (event) {
				dom.classList.add('hidden');
			});

			let army_list = document.createElement('div');
			army_list.classList.add('army_recrut_list');

			Object.entries(Unit).forEach(function (troop) {
				console.log('on passe sur '+troop);
				let troop_div = document.createElement('div');
				troop_div.classList.add('troop_army_recrut');
				troop_div.innerText = troop[0];
				troop_div.addEventListener('click', async function() {
					let options = {
						'city_id': curent_city_id,
						'unit_type': troop[1]
					};
					await Socket.send('UNIT RECRUT', options);
				})
				army_list.appendChild(troop_div);
			});
			dom.appendChild(head);
			dom.appendChild(close);
			dom.appendChild(army_list);
		
		});
	}

	function show_army() {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			let head = document.createElement('div');
			head.innerText = 'Gestions des armées de la ville';
			head.classList.add('floating_header');

			let close = document.createElement('div');
			close.classList.add('close_floating');
			close.innerText = 'X';
			close.addEventListener('click', function (event) {
				dom.classList.add('hidden');
			});
			dom.appendChild(head);
			dom.appendChild(close);
		});
	}

	function show_recherche() {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			let head = document.createElement('div');
			head.innerText = 'Recherches';
			head.classList.add('floating_header');

			let close = document.createElement('div');
			close.classList.add('close_floating');
			close.innerText = 'X';
			close.addEventListener('click', function (event) {
				dom.classList.add('hidden');
			});
			dom.appendChild(head);
			dom.appendChild(close);

		});
	}

	function show_commerce() {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			let head = document.createElement('div');
			head.innerText = 'Gestions des caravanes commerciales';
			head.classList.add('floating_header');

			let close = document.createElement('div');
			close.classList.add('close_floating');
			close.innerText = 'X';
			close.addEventListener('click', function (event) {
				dom.classList.add('hidden');
			});
			dom.appendChild(head);
			dom.appendChild(close);

		});
	}

	function show_guild() {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			let head = document.createElement('div');
			head.innerText = 'Gestion de la guilde';
			head.classList.add('floating_header');

			let close = document.createElement('div');
			close.classList.add('close_floating');
			close.innerText = 'X';
			close.addEventListener('click', function (event) {
				dom.classList.add('hidden');
			});
			dom.appendChild(head);
			dom.appendChild(close);

		});
	}


	function show_menu(type) {
		document.querySelectorAll('.floating_menu').forEach(function(dom) {
			dom.classList.remove('hidden');
			dom.innerHTML = '';
			dom.childNodes.forEach(function (child) {
				dom.removeChild(child);
			});
		});
		switch(type) {
			case 'army_recrut':
				show_recrutement();
				break;
			case 'army':
				show_army();
				break;
			case 'recherche':
				show_recherche();
				break;
			case 'commerce':
				show_commerce();
				break;
			case 'guild':
				show_guild();
				break;
			default:
				console.log('pas de menu trouvé');
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

	async function init() {
		document.querySelectorAll('.int_btn_construct').forEach(dom => {
			dom.addEventListener('click', event => {
				document.querySelectorAll('.int_construct').forEach(dom => {
					dom.classList.toggle('shown');
				})
			});
		});

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

		document.querySelectorAll('.int_menu_army_recrut').forEach((dom) => {
			dom.addEventListener('click', () => show_menu('army_recrut'));
		});
		document.querySelectorAll('.int_menu_army').forEach((dom) => {
			dom.addEventListener('click', () => show_menu('army'));
		});
		document.querySelectorAll('.int_menu_recherche').forEach((dom) => {
			dom.addEventListener('click', () => show_menu('recherche'));
		});
		document.querySelectorAll('.int_menu_commerce').forEach((dom) => {
			dom.addEventListener('click', () => show_menu('commerce'));
		});
		document.querySelectorAll('.int_menu_guild').forEach((dom) => {
			dom.addEventListener('click', () => show_menu('guild'));
		});
	}

	async function init_city(city_id) {
		engine.force_resize();
		map.focus(64*64, 64*64, .5);


		// Initialise les inputs avec la map
		map.mousedown(mousedown);
		map.mouseup(mouseup);

		let city = await City(engine, map, city_id);
		city.init();
		city_list[city_id] = city;
		curent_city_id = city_id;

		
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
		init_city: init_city,
		deinit: deinit,
		click: click,
	}
}

export default Interface;