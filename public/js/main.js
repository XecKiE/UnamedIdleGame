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


import {Engine, Resources, Mouse, Touches} from './engine/main.js';
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
	'iron_mine': 'img/sprites/iron_mine.png',
	'iron': 'img/sprites/iron.png',
	'gold_mine': 'img/sprites/gold_mine.png',
	'gold': 'img/sprites/gold.png',
	'wood_camp': 'img/sprites/wood_camp.png',
	'wood': 'img/sprites/wood.png',
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
		// Touches.add_listener(can);


		engine.render(() => {
			city.render();
		});
	});

	document.querySelectorAll('.int_btn_construct').forEach(dom => {
		dom.addEventListener('click', event => {
			document.querySelectorAll('.int_construct').forEach(dom => {
				dom.classList.toggle('shown');
			})
		});
	});
}

async function init_login() {
	document.querySelectorAll('.auth_type > *').forEach(dom => dom.addEventListener('click', event => {
		if(!dom.classList.contains('selected')) {
			document.querySelectorAll('.auth_type > *').forEach(dom => dom.classList.toggle('selected'));
			document.querySelectorAll('.auth_login, .auth_register').forEach(dom => dom.classList.toggle('hidden'));
		}
	}));
	document.querySelectorAll('.opt_logout').forEach(dom => {
		dom.addEventListener('click', event => {
			localStorage.removeItem('session_id');
			document.querySelectorAll('.authentification').forEach(dom => dom.classList.remove('hidden'));
			document.querySelectorAll('.interface').forEach(dom => dom.classList.add('hidden'));
		});
	});
	document.querySelectorAll('.opt_reload').forEach(dom => {
		dom.addEventListener('click', event => {
			dom.classList.add('hidden');
			Socket.init();
		});
	});
	// TODO on peut pas se déco reco

	// TODO si on réouvre la connexion dynamiquement on sera pas authentifié faut gérer ça du coup dans socket.js de manière propre
	let session_id = localStorage.getItem('session_id');
	if(session_id) {
		try {
			let data = await Socket.send('CONNECT', {session_id: session_id});
			if(data.success) {
				init_player(data.city_id);
			} else {
				localStorage.removeItem('session_id')
			}// TOdo les try catch c'est caca. Se mettre d'acord avec thomas pour utiliser error que pour des erreurs type réseau pas prévues. Pas pour juste "j'ai pas pu me logger" ou "j'ai pas pu construire ça"
		} catch {
			localStorage.removeItem('session_id')
		}
	}
	document.querySelectorAll('.authentification form').forEach(dom => {
		dom.addEventListener('submit', async event => {
			event.preventDefault();

			if(dom.type.value == 'register') {
				let data = await Socket.send('REGISTER', {user: dom.login.value, password: dom.passwd.value});
			}
			let data = await Socket.send('CONNECT', {user: dom.login.value, password: dom.passwd.value});
			if(data.success) {
				localStorage.setItem('session_id', data.session_id)
				init_player(data.city_id);
			}
		});
	});
	document.querySelectorAll('.loading').forEach((dom) => dom.classList.add('fade'));
}