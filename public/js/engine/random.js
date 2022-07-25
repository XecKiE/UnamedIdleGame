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

export default Random;