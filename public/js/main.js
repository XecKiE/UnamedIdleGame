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


import {Engine, Resources} from './engine/engine.js';


var a = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
})
window.onload = function() {
	document.querySelectorAll('canvas').forEach((can) => {
		a = Engine(can);
		a.render(() => {
			a.draw('wolf', a.w()/3, a.h()/2, -a.dt()%Math.PI*2);
			a.draw('cow', 2*a.w()/3, a.h()/2, a.dt()%Math.PI*2);
		});
		
	})
}