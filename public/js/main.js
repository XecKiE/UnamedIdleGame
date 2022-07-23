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


import {Engine, Resources, Map} from './engine/engine.js';
import City from './city.js';


var engine = null;
var map = null;
var city = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
	'grass': 'img/sprites/grass.png',
	'house': 'img/sprites/house.png',
	'watchtower': 'img/sprites/watchtower.png',
	'tree0': 'img/sprites/tree0.png',
	'tree1': 'img/sprites/tree1.png',
	'tree2': 'img/sprites/tree2.png',
	'tree3': 'img/sprites/tree3.png',
})
window.onload = function() {
	document.querySelectorAll('canvas').forEach((can) => {
		engine = Engine(can);

		map = engine.add_map();
		// map.focus(64*64, 64*64, .5);

		city = City();

		engine.render(() => {

			city.render(engine, map);
		});
		// Initialise le menu de construction
	})



}