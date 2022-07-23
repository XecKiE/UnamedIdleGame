const Resources = function() {
	const data = {};

	function load_img(urls) {
		for(let id in urls) {
			let img = new Image();
			img.src = urls[id]
			data[id] = img;
		}
	}

	function get_img(id) {
		return data[id];
	}

	return {
		load_img: load_img,
		get_img: get_img,
	}
}();


const Engine = function(_dom, _options = {}) {
	let can = null;
	let ctx = null;
	let width = null;
	let height = null;
	let listeners = {
		'resize': [],
		'update': [],
		'render': [],
	};
	let fps = {
		L: 0,                   // Date de la dernière actualisation des ips
		S: 0,                   // Nombre d'images depuis la dernière actualisation
		C: 0,                   // Dernier benchmark
		now: Date.now(),        // Date de début du cycle actuel
		lastLoop: Date.now(),   // Date de début du cycle précédent
		dt: 0,                  // Délai d'actualisation pendant le cycle
	}
	let options = {
		clean_frame: '#000',    // Nettoie la fenêtre complètement à chaque appel de render avec cette couleur. Ne fait rien si false
		show_debug: true,       // Affiche la fenêtre de debug
		pixelated: true,        // Force la pixélisation des sprites
	}
	let debug = {
		fps: 0,
	}


	for(var option in _options) {
		if(options[option]) {
			options[option] = _options[option];
		}
	}
	can = _dom;
	ctx = can.getContext('2d');
	window.addEventListener('resize', (event) => resize(event));
	resize();

	loop();


	function resize(event) {
		width = can.offsetWidth;
		height = can.offsetHeight;
		can.setAttribute('width', width);
		can.setAttribute('height', height);
		listeners['resize'].forEach((callback) => callback(this));

		// Si on le met dans load ça marche pas, je ne sais pas pourquoi
		if(options.pixelated) {
			ctx.imageSmoothingEnabled = false;
		}
	}

	function loop() {
		fps.now = Date.now();
		fps.S++;
		if(fps.now-fps.L > 1000) {
			fps.C = fps.S;
			debug.fps = fps.C;
			fps.S = 0;
			fps.L = fps.now;
		}
		fps.dt = (fps.now - fps.lastLoop) / 1000.0;

		update();
		render();


		requestAnimationFrame(() => loop());
	}

	function update() {
		listeners['update'].forEach((callback) => callback(this));
	}

	function render() {
		// Clean frame
		if(options.clean_frame) {
			ctx.fillStyle = options.clean_frame;
			ctx.fillRect(0, 0, width, height);
		}

		// try {
			listeners['render'].forEach((callback) => callback(this));
		// } catch (error) {
		// 	console.error(error);
		// }

		// Debug informations
		if(options.show_debug) {
			ctx.fillStyle = 'rgb(255,0,0)';
			ctx.font="bold 15px Verdana";
			ctx.textAlign="right";
			ctx.textBaseline="top";
			var h = 0;
			for(var i in debug) {
				ctx.fillText(i+' : '+debug[i], width, h);
				h += 15;
			}
		}
	}

	function draw(sprite_id, x, y, dx, dy, rotation = 0) {
		let sprite = Resources.get_img(sprite_id);
		ctx.save();
		ctx.translate(x + width/2, y + height/2);
		if(rotation) {
			ctx.rotate(rotation);
		}
		// ctx.scale(...mirror);
		ctx.drawImage(sprite, -dx/2, -dy/2, dx, dy);
		ctx.restore();
	}

	return {
		w: () => width,
		h: () => height,
		dt: () => fps.dt,

		draw: draw,

		resize: (callback) => listeners.resize.push(callback),
		update: (callback) => listeners.update.push(callback),
		render: (callback) => listeners.render.push(callback),

		add_map: () => Map(can),
	}
}


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
	
	let listeners = {
		'mousedown': [],
		'mouseup': [],
	}


	const x_to_screen = (t) => (t-x)*z;
	const y_to_screen = (t) => (t-y)*z;
	const scale_to_screen = (t) => t*z;

	const screen_to_x = (t) => (t - dom.width/2)/z + x;
	const screen_to_y = (t) => (t - dom.height/2)/z + y;


	const mouse_down = (event) => {
		let _x = event.clientX - left;
		let _y = event.clientY - top;
		if(event.button == 0) {
			mx = _x;
			my = _y;
			window.addEventListener('mousemove', mouse_move);
			window.addEventListener('mouseup', mouse_up);
			event.preventDefault();
		}

		listeners.mousedown.forEach((callback) => callback(screen_to_x(_x), screen_to_y(_y), event.button));
	};
	const release_mouse = () => {
		mx = null;
		my = null;
		window.removeEventListener('mousemove', mouse_move);
		window.removeEventListener('mouseup', mouse_up);
	}
	const mouse_up = (event) => {
		let _x = event.clientX - left;
		let _y = event.clientY - top;
		if(event.button == 0) {
			release_mouse();
			event.preventDefault();
		}
		listeners.mouseup.forEach((callback) => callback(screen_to_x(_x), screen_to_y(_y), event.button));
	};
	const mouse_move = (event) => {
		let _x = event.clientX - left;
		let _y = event.clientY - top;
		_move((mx - _x)/z,  (my - _y)/z);
		mx = _x;
		my = _y;
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


	function _zoom(_z, _x, _y) {
		var t = z;
		z = Math.max(/*TODO 1*/0.3, Math.min(z*_z, 4));

		_x -= dom.width/2
		_y -= dom.height/2

		x += _x/t - _x/z;
		y += _y/t - _y/z;
	}
	function _move(_x, _y) {
		x += _x;
		y += _y;
	}


	function resize() {
		let rect = dom.getBoundingClientRect();
		top = rect.top;
		left = rect.left;
	}
	window.addEventListener('resize', (event) => {
		resize();
	});
	resize();


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

		focus: focus,
		min_x: (t = 0) => x - (dom.width/2)/z + t, // Ces fonctions peuvent recevoir en paramètre une largeur de tile à prendre en compte
		min_y: (t = 0) => y - (dom.height/2)/z + t,
		max_x: (t = 0) => x + (dom.width/2)/z + t,
		max_y: (t = 0) => y + (dom.height/2)/z + t,

		mousedown: mousedown,
		mouseup: mouseup,
		remove_mousedown: remove_mousedown,
		remove_mouseup: remove_mouseup,
	}
}


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

		disable_context_menu: disable_context_menu,
	}
}();


const Touches = function() {
	let touches = {};

	window.addEventListener('touchstart',  (event) => {
		[...event.touches].map((a) => {
			return {x: a.clientX, y: a.clientY};
		});
	});
	window.addEventListener('touchend',  (event) => {
		[...event.touches].map((a) => {
			return {x: a.clientX, y: a.clientY};
		});
	});
	window.addEventListener('touchmove',  (event) => {
		[...event.touches].map((a) => {
			return {x: a.clientX, y: a.clientY};
		});
	});

	return {
		get: touches,
	}
}();

const Random = function() {
	/**
	* Génère un entier aléatoire
	* @param  {int} a Premier entier
	* @param  {int} b Deuxième entier [default: 0] (max exclut)
	* @return {int}   L'entier aléatoire
	*/
	function i_rand(a, b) {
		if(typeof b != 'undefined') {
			return Math.floor(Math.random()*(b-a))+a;
		} else {
			return Math.floor(Math.random()*a);
		}
	}

	/**
	* Génère un réel aléatoire
	* @param  {float} a Premier réel
	* @param  {float} b Deuxième réel [default: 0] (max exclut)
	* @return {float}     Le réel aléatoire
	*/
	function f_rand(a, b) {
		if(typeof b != 'undefined') {
			return Math.random() * (b - a) + a;
		} else {
			return Math.random() * a;
		}
	}

	return {
		i_rand: i_rand,
		f_rand: f_rand,
	}
}();



export {Engine, Map, Resources, Keyboard, Mouse, Touches, Random};