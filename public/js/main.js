// console.log('coucou');


// export function yo() {
// 	console.log('yo');
// }



// import Engine from './engine/engine.js';
// var a = [];
// window.onload = function() {
// 	document.querySelectorAll('canvas').forEach((can) => {
// 		a.push(new Engine(can));
// 	})
// }


import {Engine, Resources, Map, Mouse} from './engine/engine.js';
import City from './city.js';
import Socket from './socket.js';


var engine = null;
var map = null;
var city = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
	'hammer': 'img/sprites/hammer.png',
	'focus': 'img/sprites/focus.png',
	'grass': 'img/sprites/grass.png',
	'desert': 'img/sprites/desert.png',
	'house': 'img/sprites/house.png',
	'watchtower': 'img/sprites/watchtower.png',
	'tree0': 'img/sprites/tree0.png',
	'tree1': 'img/sprites/tree1.png',
	'tree2': 'img/sprites/tree2.png',
	'tree3': 'img/sprites/tree3.png',
})
Mouse.disable_context_menu();
window.onload = async function() {
	document.querySelectorAll('canvas').forEach(async (can) => {
		let truc = await Socket.send('GET CITY_TILE', {city_id: 1});
		console.log(truc);
		truc = await Socket.send('CHOSE CITY_TILE', {city_id: 1});
		console.log(truc);

		engine = Engine(can);

		map = engine.add_map();

		city = City(engine, map);
		city.init();


		engine.render(() => {
			city.render();
		});


		// city.deinit(map);
	})
}