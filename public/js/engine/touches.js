const Touches = function() {
	let touches = {};

	window.addEventListener('touchstart',  (event) => {
		let dom = document.querySelector('.int_city');
		[...event.touches].map((a, i) => {
			return {id: a.identifier, x: a.clientX, y: a.clientY};
		});
	});
	window.addEventListener('touchend',  (event) => {
		let dom = document.querySelector('.int_city');
		[...event.touches].map((a, i) => {
			return {id: a.identifier, x: a.clientX, y: a.clientY};
		});
	});
	window.addEventListener('touchmove',  (event) => {
		let dom = document.querySelector('.int_city');
		[...event.touches].map((a, i) => {
			return {id: a.identifier, x: a.clientX, y: a.clientY};
		});
	});


	return {
		get: touches,
	}
}();

export default Touches;