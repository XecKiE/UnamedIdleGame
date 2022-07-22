// Créer une connexion WebSocket
const socket = new WebSocket('ws://localhost:8081');

// La connexion est ouverte
socket.addEventListener('open', function (event) {
	var data = {
		action: 'BUILD TAVER',
		options: '3'
	};
socket.send(JSON.stringify(data));
});

// Écouter les messages
socket.addEventListener('message', function (event) {
  console.log('Voici un message du serveur', event.data);
});