// Créer une connexion WebSocket
const socket = new WebSocket('ws://localhost:8081');

// La connexion est ouverte
socket.addEventListener('open', function (event) {
	var data = {
		action: 'CONNECT',
		options: {user:'test', password:'test'}
	};
socket.send(JSON.stringify(data));
});

// Écouter les messages
socket.addEventListener('message', function (event) {
  console.log('Voici un message du serveur', event.data);
});

function build_taverne() {
	console.log('coucou');
	/*var data = {
		action: 'BUILD',
		options: {
			city_id:1,
			type:2,
			x:10,
			y:10,
			rotation:0,
		}
	};*/
	var data = {
		action: 'GET CITY_TILE',
		options: {
			city_id: 1,
		}

	};
	socket.send(JSON.stringify(data));
}

