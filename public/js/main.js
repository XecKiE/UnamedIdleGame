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
			for(var i=0 ; i<20 ; i++) {
				for(var j=0 ; j<20 ; j++) {
					engine.draw(i%5 == 0 || j%5 == 0 ?'wolf' : 'cow', map.x(i*100), map.y(j*100), map.s(100), map.s(100));
				}
			}

			engine.draw('wolf', map.x(engine.w()/3), map.y(engine.h()/2), map.s(256), map.s(256), -engine.dt()%Math.PI*2);
			engine.draw('cow', map.x(2*engine.w()/3), map.y(engine.h()/2), map.s(256), map.s(256), engine.dt()%Math.PI*2);
		});
		
	})
}