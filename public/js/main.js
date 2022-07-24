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
var city_data = null;
Resources.load_img({
	'wolf': 'img/favicon.png',
	'cow': 'img/placeholder.png',
	'hammer': 'img/sprites/hammer.png',
	'focus': 'img/sprites/focus.png',
	'grass': 'img/sprites/grass.png',
	'desert': 'img/sprites/desert.png',
	'water': 'img/sprites/water.png',
	'mud': 'img/sprites/mud.png',
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
	init_login();
	// init_player();
}


async function init_player(city_id) {
	document.querySelectorAll('.authentification').forEach(dom => dom.classList.add('hidden'));
	document.querySelectorAll('.interface').forEach(dom => dom.classList.remove('hidden'));
	document.querySelectorAll('canvas').forEach(async (can) => {

		engine = Engine(can);
		map = engine.add_map();
		city = await City(engine, map, city_id);
		city.init();


		engine.render(() => {
			city.render();
		});
	})
}

function init_login() {
	document.querySelectorAll('.auth_type > *').forEach(dom => dom.addEventListener('click', event => {
		if(!dom.classList.contains('selected')) {
			document.querySelectorAll('.auth_type > *').forEach(dom => dom.classList.toggle('selected'));
			document.querySelectorAll('.auth_login, .auth_register').forEach(dom => dom.classList.toggle('hidden'));
		}
	}));

	document.querySelectorAll('.authentification form').forEach(dom => {
		dom.addEventListener('submit', async event => {
			event.preventDefault();

			if(dom.type.value == 'register') {
				let data = await Socket.send('REGISTER', {user: dom.login.value, password: dom.passwd.value});
			}
			let data = await Socket.send('CONNECT', {user: dom.login.value, password: dom.passwd.value});
				console.log(data)
			if(data.success) {
				init_player(data.city_id);
			}
		});
	});
}