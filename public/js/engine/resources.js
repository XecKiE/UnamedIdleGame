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


export default Resources;