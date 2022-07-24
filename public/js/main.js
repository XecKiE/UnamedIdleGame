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
import {Random, Noise} from './shared/random.js';
import CityData from './shared/city_data.js';


var engine = null;
var map = null;
var city = null;
var city_data = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
	'hammer': 'img/sprites/hammer.png',
	'focus': 'img/sprites/focus.png',
	'grass': 'img/sprites/grass.png',
	'desert': 'img/sprites/desert.png',
	'road': 'img/sprites/road.png',
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
		// let truc = await Socket.send('GET CITY_TILE', {city_id: 1});
		// console.log(truc);
		// truc = await Socket.send('CHOSE CITY_TILE', {city_id: 1});
		// console.log(truc);

		var r = new Random(20);
		let res = [];
		for (var i = 0; i < 10; i++)
			res.push(r.nextRange(0, 2))
		console.log(res.join(' '))

		// var digits = ['0ds', '1', 'ss2', '3', '4', '5cx', '6', '7ss', '8', '9'];
		// res = [];
		// for (var i = 0; i < 10; i++)
		// 	res.push(r.choice(digits));
		// console.log(res.join(' '))

		// let noise = new Noise(50);
		// console.log(noise.noise2D(5, 5))

		city_data = CityData();



		engine = Engine(can);

		map = engine.add_map();

		city = await City(engine, map);
		city.init();


		engine.render(() => {
			city.render();
		});


		// city.deinit(map);
	})
}