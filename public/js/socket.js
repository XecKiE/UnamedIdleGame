const Socket = function() {
	let socket = null;
	let message_increment = 1;
	let timeout = 2000;
	let timeout_id = null;
	let reconnect = false;
	let authentified = false;

	let queue = [];
	let promises = [];


	init();



	function init() {
		if (timeout_id !== null) {
			clearTimeout(timeout_id);
			timeout_id = null;
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
		if(reconnect) {
			let session_id = localStorage.getItem('session_id');
			if(session_id) {
				authenticate({'session_id': session_id});
			}
		}
	}
	async function onerror(event) {
		console.error(event);
	}
	async function onclose(event) {
		authentified = false;
		reconnect = true;
		timeout_id = setTimeout(function() { init(); }, timeout);
		timeout *= 2;
		document.querySelectorAll('.opt_reload').forEach(dom => {
			dom.classList.remove('hidden');
		});
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
		console.log(action)
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
			if(authentified || action == 'CONNECT' || action == 'REGISTER') {
				send_message(data);
			} else {
				queue.push(data);
			}
			message_increment++;
		});
	}

	async function send_message(data) {
		socket.send(JSON.stringify(data));
	}

	async function authenticate(credentials = null) {
		let data = await Socket.send('CONNECT', credentials ? credentials : {session_id: localStorage.getItem('session_id')});
		if(data.success) {
			authentified = true;
			localStorage.setItem('session_id', data.session_id)
			// On vide la queue
			let message;
			while(message = queue.pop()) {
				send_message(message);
			}
			return data.city_id;
		} else {
			authentified = false;
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