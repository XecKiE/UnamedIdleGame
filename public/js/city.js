import {Random, Mouse} from './engine/main.js'
import Socket from './socket.js';
import {CB, CBR} from './shared/Shared.js'
import CityData from './shared/city_data.js';

const City = async function(_engine, _map, _city_id) {
	let engine = _engine;
	let map = _map;
	let city_id = _city_id;
	let tiles = [];
	let city_name = '';
	let ressources_qte = {};
	let ressources_prd = {};

	let selection = null;
	let clicked_tile = null;
	let options = {
		city_id: city_id
	};
	try {
		let city_info = await Socket.send('GET PLAYER_CITIES', options);
		var tiles_modified = [];
		city_info.tiles.forEach(function(data) {
			if (tiles_modified[data.x] === undefined) {
				tiles_modified[data.x] = [];
			}
			tiles_modified[data.x][data.y] = data;
		});
		city_name = city_info.name;
		ressources_qte = {
			iron: city_info.iq,
			wood: city_info.wq,
			gold: city_info.gq,
		}
		ressources_prd = {
			iron: city_info.ip,
			wood: city_info.wp,
			gold: city_info.gp,
		}

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

		/*if(selection && Mouse.has_mouse()) {
			let pos = Mouse.position();
			let tile = coord_to_tile(map.screen_to_x(pos.x), map.screen_to_y(pos.y));
			engine.draw('focus', map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
			// engine.draw_rect(map.x(tile.x*64), map.y(tile.y*64), map.s(64), map.s(64));
		}*/
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
		let tile = coord_to_tile(map.screen_to_x(x), map.screen_to_y(y));
		tiles[x][y].onclick();
	}

	function coord_to_tile(x, y) {
		return {
			x: Math.floor((x+32)/64),
			y: Math.floor((y+32)/64),
		}
	}

	
		

	function init() {
		

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
		tiles: tiles,
		city_name: city_name,
		ressources_qte: ressources_qte,
	}
}

export default City;