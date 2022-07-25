const Keyboard = function() {
	let keys = {};

	window.addEventListener('keydown', (event) => {
		keys[event.code] = true;
	});
	window.addEventListener('keyup', (event) => {
		keys[event.code] = false;
	});

	return {
		pressed: (key_code) => keys[key_code],
	}
}();

export default Keyboard;