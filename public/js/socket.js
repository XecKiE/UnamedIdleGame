const Socket = function() {
	let socket = null;
	let message_increment = 1;

	let promises = [];


	init();



	function init() {
		socket = new WebSocket('ws://localhost:8081');
		socket.onopen = onopen;
		socket.onerror = onerror;
		socket.onmessage = onmessage;
	}

	async function onopen(event) {
		let data = await send('CONNECT', {user:'test', password:'test'});
		// TODO ajouter une queue dans que pas authentifié
	}
	async function onerror(event) {
		console.log(event);
		// TODO relancer init toutes les 2-4-8-16-32-64-... secondes
	}
	async function onmessage(event) {
		let data = JSON.parse(event.data);
		if(promises[data.idr]) {
			if(data.data) {
				promises[data.idr].resolve(data.data);
			} else if(data.error) {
				promises[data.idr].reject(data.error);
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


	return {
		send: send,
	};
}();


export default Socket;