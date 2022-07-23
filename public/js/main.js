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


var engine = null;
var map = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
})
window.onload = function() {
	document.querySelectorAll('canvas').forEach((can) => {
		engine = Engine(can);

		map = engine.add_map();

		engine.render(() => {
			for(var i=-20 ; i<21 ; i++) {
				for(var j=-20 ; j<21 ; j++) {
					engine.draw(i%5 == 0 || j%5 == 0 ?'wolf' : 'cow', map.x(i*100), map.y(j*100), map.s(100), map.s(100));
				}
			}

			engine.draw('cow', map.x(-engine.w()/6), map.y(-engine.h()/4), map.s(256), map.s(256), engine.dt()%Math.PI*2);
			engine.draw('wolf', map.x(engine.w()/6), map.y(-engine.h()/4), map.s(256), map.s(256), -engine.dt()%Math.PI*2);
			engine.draw('wolf', map.x(-engine.w()/6), map.y(engine.h()/4), map.s(256), map.s(256), -engine.dt()%Math.PI*2);
			engine.draw('cow', map.x(engine.w()/6), map.y(engine.h()/4), map.s(256), map.s(256), engine.dt()%Math.PI*2);
		});
	})

	// let debut = Date.now();
	// setInterval(() => {
	// 	console.log('coucou')
	// 	map.focus((Date.now() - debut)/10, (Date.now() - debut)/10, 1.5);
	// 	console.log((Date.now() - debut)/10)
	// }, 1);
	map.focus(2048, 2048, 1);
	// map.focus(engine.w()/6, engine.h()/4, 1);
}