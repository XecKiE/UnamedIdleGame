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
	'tree0': 'img/sprites/tree0.png',
	'tree1': 'img/sprites/tree1.png',
	'tree2': 'img/sprites/tree2.png',
	'tree3': 'img/sprites/tree3.png',
	'house_top': 'img/sprites/house_top.png',
	'tree_top0': 'img/sprites/tree_top0.png',
	'tree_top1': 'img/sprites/tree_top1.png',
	'tree_top2': 'img/sprites/tree_top2.png',
	'tree_top3': 'img/sprites/tree_top3.png',
})
window.onload = function() {
	document.querySelectorAll('canvas').forEach((can) => {
		engine = Engine(can);

		map = engine.add_map();

		city = City();

		engine.render(() => {
			// for(var i=-20 ; i<21 ; i++) {
			// 	for(var j=-20 ; j<21 ; j++) {
			// 		engine.draw(i%5 == 0 || j%5 == 0 ?'wolf' : 'cow', map.x(i*100), map.y(j*100), map.s(100), map.s(100));
			// 	}
			// }

			// engine.draw('cow', map.x(-engine.w()/6), map.y(-engine.h()/4), map.s(256), map.s(256), engine.dt()%Math.PI*2);
			// engine.draw('wolf', map.x(engine.w()/6), map.y(-engine.h()/4), map.s(256), map.s(256), -engine.dt()%Math.PI*2);
			// engine.draw('wolf', map.x(-engine.w()/6), map.y(engine.h()/4), map.s(256), map.s(256), -engine.dt()%Math.PI*2);
			// engine.draw('cow', map.x(engine.w()/6), map.y(engine.h()/4), map.s(256), map.s(256), engine.dt()%Math.PI*2);

			city.render(engine, map);
		});
	})

	// let debut = Date.now();
	// setInterval(() => {
	// 	console.log('coucou')
	// 	map.focus((Date.now() - debut)/10, (Date.now() - debut)/10, 1.5);
	// 	console.log((Date.now() - debut)/10)
	// }, 1);
	// map.focus(2048, 2048, 1);
	// map.focus(engine.w()/6, engine.h()/4, 1);
}