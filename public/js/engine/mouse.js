const Mouse = function() {
	let x = 0;
	let y = 0;
	let left = false;
	let right = false;
	let middle = false;

	window.addEventListener('mousemove', (event) => {
		x = event.clientX;
		y = event.clientY;
	});
	window.addEventListener('mousedown', (event) => {
		switch(event.button) {
			case 0: left   = true; break;
			case 1: middle = true; break;
			case 2: right  = true; break;
		}
	});
	window.addEventListener('mouseup', (event) => {
		switch(event.button) {
			case 0: left   = false; break;
			case 1: middle = false; break;
			case 2: right  = false; break;
		}

	});
	window.addEventListener('wheel', (event) => {

	});

	function disable_context_menu() {
		window.oncontextmenu = (event) => event.preventDefault();
	}

	return {
		position: () => {return {x: x, y: y};},
		left:     () => left,
		middle:   () => middle,
		right:    () => right,

		has_mouse: () => matchMedia('(pointer:fine)').matches,

		disable_context_menu: disable_context_menu,
	}
}();

export default Mouse;