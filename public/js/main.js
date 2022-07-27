import {Engine, Resources, Mouse} from './engine/main.js';
import Interface from './interface.js';
import Socket from './socket.js';


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
	'wooden_house': 'img/sprites/wooden_house.png',
	'autel': 'img/sprites/autel.png',
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
	'caserne': 'img/sprites/caserne.png',
})
Mouse.disable_context_menu();


let inter = null;

window.onload = async function() {
	await init_engine();
	await inter.init();
	await init_login();

	document.querySelectorAll('.loading').forEach((dom) => dom.classList.add('fade'));
}


async function init_player(city_id) {
	document.querySelectorAll('.authentification').forEach(dom => dom.classList.add('hidden'));
	document.querySelectorAll('.interface').forEach(dom => dom.classList.remove('hidden'));
	

	await inter.init_city(city_id);
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


	document.querySelectorAll('.authentification form').forEach(dom => {
		dom.addEventListener('submit', async event => {
			event.preventDefault();

			if(dom.type.value == 'register') {
				let data = await Socket.send('REGISTER', {user: dom.login.value, password: dom.passwd.value});
			}
			let data = await Socket.authenticate({user: dom.login.value, password: dom.passwd.value});
			if(data !== null) {
				init_player(data);
			}
		});
	});
}
async function init_engine() {
	document.querySelectorAll('canvas').forEach(async (can) => {
		let engine = Engine(can);
		let map = engine.add_map();
		inter = await Interface(engine, map);

		engine.render(() => {
			inter.render();
		});

		return inter;
	});
}