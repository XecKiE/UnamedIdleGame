const Socket = function() {
	let socket = null;
	let message_increment = 1;
	let timeout = 2000;
	let timeout_id = null;
	let reconnect = false;

	let promises = [];


	init();
	// TODO si on réouvre la connexion on sera pas authentifié faut gérer ça du coup

	function init() {
		if (timeout_id !== null) {
			clearTimeout(timeout_id);
			timeout_id = null;
			reconnect = true;
		}
		let ws_url = window.location.protocol.replace('http', 'ws')+'//'+window.location.hostname;
		if(window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') {
			ws_url += ':8081';
		}
		socket = new WebSocket(ws_url);
		socket.onopen = onopen;
		socket.onerror = onerror;
		socket.onclose = onclose;
		socket.onmessage = onmessage;
	}

	async function onopen(event) {
		if (reconnect) {
			reconnect = false;
			let session_id = localStorage.getItem('session_id');
			if(session_id) {
				authenticate();
			}
		}
		// let data = await send('CONNECT', {user:'test', password:'test'});
		// TODO ajouter une queue dans que pas authentifié
	}
	async function onerror(event) {
		// TODO relancer init toutes les 2-4-8-16-32-64-... secondes
	}
	async function onclose(event) {
		timeout_id = setTimeout(function() { init(); }, timeout);
		timeout *= 2;
		document.querySelectorAll('.opt_reload').forEach(dom => {
			dom.classList.remove('hidden');
		});
		
		// TODO relancer init toutes les 2-4-8-16-32-64-... secondes
	}
	async function onmessage(event) {
		let data = JSON.parse(event.data);
		if(promises[data.idr]) {
			if(data.data) {
				promises[data.idr].resolve(data.data);
				delete promises[data.idr];
			} else if(data.error) {
				promises[data.idr].reject(data.error);
				delete promises[data.idr];
			} else {
				console.log('reçu un message chelou', data)
			}
		} else {
			console.log('reçu un message chelou', data)
		}
	}


	async function send(action, options = {}) {
		return new Promise((resolve, reject) => {
			promises[message_increment] = {
				resolve: resolve,
				reject: reject,
			};
			let data = {
				id: message_increment,
				action: action,
				options: options,
			}
			socket.send(JSON.stringify(data));
			message_increment++;
		});
	}

	async function authenticate(credentials = null) {
		let data = await Socket.send('CONNECT', credentials ? credentials : {session_id: localStorage.getItem('session_id')});
		console.log(data);
		if(data.success) {
			localStorage.setItem('session_id', data.session_id)
			return data.city_id;
		} else {
			localStorage.removeItem('session_id')
			return false;
		}
	}


	return {
		send: send,
		authenticate: authenticate,
	};
}();


export default Socket;