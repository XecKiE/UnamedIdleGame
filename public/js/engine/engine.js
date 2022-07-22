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

		try {
			listeners['render'].forEach((callback) => callback(this));
		} catch (error) {
			console.error(error);
		}

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

	function draw(sprite_id, x, y, rotation = 0) {
		let sprite = Resources.get_img(sprite_id);
		ctx.save();
		ctx.translate(x, y);
		if(rotation) {
			ctx.rotate(rotation);
		}
		// ctx.scale(...mirror);
		ctx.drawImage(sprite, -sprite.naturalWidth/2, -sprite.naturalHeight/2, sprite.naturalWidth, sprite.naturalHeight);
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
	}
}



export {Engine, Resources};