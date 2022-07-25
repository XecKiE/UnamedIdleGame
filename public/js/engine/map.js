import Mouse from './mouse.js';

/**
 * Permet de suivre l'état d'une carte type Google Maps et de gérer les déplacements dessus
 */
const Map = function(_dom) {
	let dom = _dom;
	let top = null;
	let left = null;
	let z = 1;       // Zoom
	let x = 0;
	let y = 0;
	let mx = null;   // Coordonnées du point sélectionné lors du drag'n'drop de la carte
	let my = null;   // Coordonnées du point sélectionné lors du drag'n'drop de la carte

	let frozen = false; // Empêche le déplacmeent de la carte
	
	let listeners = {
		'mousedown': [],
		'mouseup': [],
	}


	const x_to_screen = (t) => (t-x)*z;
	const y_to_screen = (t) => (t-y)*z;
	const scale_to_screen = (t) => t*z;

	const screen_to_x = (t) => (t - left - dom.width/2)/z + x;
	const screen_to_y = (t) => (t - top - dom.height/2)/z + y;



	// Gestion de la souris
	const mouse_down = (event) => {
		let _x = event.clientX - left;
		let _y = event.clientY - top;
		if(event.button == 0 || event.button == 1) {
			mx = _x;
			my = _y;
			window.addEventListener('mousemove', mouse_move);
			window.addEventListener('mouseup', mouse_up);
			event.preventDefault();
		}

		listeners.mousedown.forEach((callback) => callback(screen_to_x(event.clientX), screen_to_y(event.clientY), event.button));
	};
	const release_mouse = () => {
		mx = null;
		my = null;
		window.removeEventListener('mousemove', mouse_move);
		window.removeEventListener('mouseup', mouse_up);
	}
	const mouse_up = (event) => {
		if(event.button == 0 || event.button == 1) {
			release_mouse();
			event.preventDefault();
		}
		listeners.mouseup.forEach((callback) => callback(screen_to_x(event.clientX), screen_to_y(event.clientY), event.button));
	};
	const mouse_move = (event) => {
		if(!frozen || Mouse.middle()) {
			let _x = event.clientX - left;
			let _y = event.clientY - top;
			_move((mx - _x)/z,  (my - _y)/z);
			mx = _x;
			my = _y;
		}
		event.preventDefault();
	};
	const mouse_wheel = (event) => {
		let pos = Mouse.position();
		_zoom(1-(event.deltaY/1000), pos.x-left, pos.y-top);
	};
	_dom.addEventListener('mousedown', mouse_down);
	_dom.addEventListener('wheel', mouse_wheel);
	window.addEventListener('contextmenu', (event) => {
		release_mouse();
	});




	// Gestion du tactile
	let touches = [];
	let dist = null;
	const touch_start = (event) => {
		window.addEventListener('touchmove', touch_move);
		window.addEventListener('touchend', touch_end);
		touch_move(event);
	};
	const touch_end = (event) => {
		if(event.touches.length === 0) {
			window.removeEventListener('mousemove', mouse_move);
			window.removeEventListener('mouseup', mouse_up);
		}
		touch_move(event);
	};
	const touch_move = (event) => {
		let new_touches = [];
		let deltas = []; // Utilisé pour calculer la moyenne du déplacement
		let distt = [];  // Utilisé pour calculer le point central des input, qui sera ensuite utilisé pour calculer la distance moyenne avec un point et en relation avec dist mettre à jour z
		[...event.touches].forEach(touch => {
			new_touches[touch.identifier] = {
				x: touch.clientX-left,
				y: touch.clientY-top,
			};
			if(touches[touch.identifier]) {
				deltas.push({
					x: new_touches[touch.identifier].x - touches[touch.identifier].x,
					y: new_touches[touch.identifier].y - touches[touch.identifier].y,
				});
				distt.push({
					x: new_touches[touch.identifier].x,
					y: new_touches[touch.identifier].y,
				})
			}
		});
		if(deltas.length) {
			let delta = deltas.reduce((a, b) => {return {x: a.x+b.x, y: a.y+b.y}}, {x: 0, y: 0});
			delta.x /= deltas.length;
			delta.y /= deltas.length;

			if(distt.length > 1) {
				let disttt = distt.reduce((a, b) => {return {x: a.x+b.x, y: a.y+b.y}}, {x: 0, y: 0});
				disttt.x /= distt.length;
				disttt.y /= distt.length;

				let new_dist = Math.sqrt(Math.pow(disttt.x-distt[0].x, 2)+Math.pow(disttt.y-distt[0].y, 2));

				if(dist !== null) {
					_set_zoom((z * new_dist) / dist);
				}

				if(new_touches.length != touches.length) {
					dist = null;
				} else {
					dist = new_dist;
				}
			} else {
				dist = null;
			}

			_move(-delta.x/z, -delta.y/z);
		}
		touches = new_touches;
	};
	_dom.addEventListener('touchstart', touch_start)








	// Gestion des coordonnées
	function _set_zoom(_z) {
		z = Math.max(/*TODO 1*/0.3, Math.min(_z, 4));
	}
	function _zoom(_z, _x, _y) {
		var t = z;
		_set_zoom(z*_z);

		_x -= dom.width/2
		_y -= dom.height/2

		x += _x/t - _x/z;
		y += _y/t - _y/z;
	}
	function _move(_x, _y) {
		x += _x;
		y += _y;
	}


	// Gestion du redimensionnement
	function resize() {
		let rect = dom.getBoundingClientRect();
		top = rect.top;
		left = rect.left;
	}
	window.addEventListener('resize', (event) => {
		resize();
	});
	resize();




	// Divers
	function focus(_x, _y, _z = null) {
		x = _x;
		y = _y;
		if(_z !== null) {
			z = _z;
		}
	}

	function mousedown(callback) {
		listeners['mousedown'].push(callback);
	}
	function mouseup(callback) {
		listeners['mouseup'].push(callback);
	}
	function remove_mousedown(callback) {
		listeners['mousedown'] = listeners['mousedown'].filter((a) => a !== callback);
	}
	function remove_mouseup(callback) {
		listeners['mouseup'] = listeners['mouseup'].filter((a) => a !== callback);
	}

	return {
		x: x_to_screen,
		y: y_to_screen,
		s: scale_to_screen,

		screen_to_x: screen_to_x,
		screen_to_y: screen_to_y,

		focus: focus,
		min_x: (t = 0) => x - (dom.width/2)/z + t, // Ces fonctions peuvent recevoir en paramètre une largeur de tile à prendre en compte
		min_y: (t = 0) => y - (dom.height/2)/z + t,
		max_x: (t = 0) => x + (dom.width/2)/z + t,
		max_y: (t = 0) => y + (dom.height/2)/z + t,

		mousedown: mousedown,
		mouseup: mouseup,
		remove_mousedown: remove_mousedown,
		remove_mouseup: remove_mouseup,
		
		set_frozen: (b) => {console.log(b); frozen = b},
	}
}

export default Map;