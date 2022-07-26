/**
 * @credit Code pompé honteusement sur https://stackoverflow.com/a/424445
 */
function Random(seed) {
	// LCG using GCC's constants
	this.m = 0x80000000; // 2**31;
	this.a = 1103515245;
	this.c = 12345;

	this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
Random.prototype.nextInt = function() {
	this.state = (this.a * this.state + this.c) % this.m;
	return this.state;
}
Random.prototype.nextFloat = function() {
	// returns in range [0,1]
	return this.nextInt() / (this.m - 1);
}
Random.prototype.nextRange = function(start, end) {
	// returns in range [start, end): including start, excluding end
	// can't modulu nextInt because of weak randomness in lower bits
	var rangeSize = end - start;
	var randomUnder1 = this.nextInt() / this.m;
	return start + Math.floor(randomUnder1 * rangeSize);
}
Random.prototype.choice = function(array) {
	return array[this.nextRange(0, array.length)];
}








/**
 * @credit Copyright (C) 2016 Jonas Wagner
 */
var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
var F3 = 1.0 / 3.0;
var G3 = 1.0 / 6.0;
var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

function SimplexNoise(seed) {
	let random = new Random(seed);
	this.p = buildPermutationTable(random);
	this.perm = new Uint8Array(512);
	this.permMod12 = new Uint8Array(512);
	for (var i = 0; i < 512; i++) {
		this.perm[i] = this.p[i & 255];
		this.permMod12[i] = this.perm[i] % 12;
	}

}
SimplexNoise.prototype = {
		grad3: new Float32Array([1, 1, 0,
														-1, 1, 0,
														1, -1, 0,

														-1, -1, 0,
														1, 0, 1,
														-1, 0, 1,

														1, 0, -1,
														-1, 0, -1,
														0, 1, 1,

														0, -1, 1,
														0, 1, -1,
														0, -1, -1]),
		grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
														0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
														1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
														-1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
														1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
														-1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
														1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
														-1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
		noise2D: function(xin, yin) {
				var permMod12 = this.permMod12;
				var perm = this.perm;
				var grad3 = this.grad3;
				var n0 = 0; // Noise contributions from the three corners
				var n1 = 0;
				var n2 = 0;
				// Skew the input space to determine which simplex cell we're in
				var s = (xin + yin) * F2; // Hairy factor for 2D
				var i = Math.floor(xin + s);
				var j = Math.floor(yin + s);
				var t = (i + j) * G2;
				var X0 = i - t; // Unskew the cell origin back to (x,y) space
				var Y0 = j - t;
				var x0 = xin - X0; // The x,y distances from the cell origin
				var y0 = yin - Y0;
				// For the 2D case, the simplex shape is an equilateral triangle.
				// Determine which simplex we are in.
				var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
				if (x0 > y0) {
					i1 = 1;
					j1 = 0;
				} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
				else {
					i1 = 0;
					j1 = 1;
				} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
				// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
				// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
				// c = (3-sqrt(3))/6
				var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
				var y1 = y0 - j1 + G2;
				var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
				var y2 = y0 - 1.0 + 2.0 * G2;
				// Work out the hashed gradient indices of the three simplex corners
				var ii = i & 255;
				var jj = j & 255;
				// Calculate the contribution from the three corners
				var t0 = 0.5 - x0 * x0 - y0 * y0;
				if (t0 >= 0) {
					var gi0 = permMod12[ii + perm[jj]] * 3;
					t0 *= t0;
					n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
				}
				var t1 = 0.5 - x1 * x1 - y1 * y1;
				if (t1 >= 0) {
					var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
					t1 *= t1;
					n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
				}
				var t2 = 0.5 - x2 * x2 - y2 * y2;
				if (t2 >= 0) {
					var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
					t2 *= t2;
					n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
				}
				// Add contributions from each corner to get the final noise value.
				// The result is scaled to return values in the interval [-1,1].
				return 70.0 * (n0 + n1 + n2);
			},
		int2D: function(xin, yin, max) {
			return Math.floor((this.noise2D(xin, yin)/2+.5)*max);
		}
	};

function buildPermutationTable(random) {
	var i;
	var p = new Uint8Array(256);
	for (i = 0; i < 256; i++) {
		p[i] = i;
	}
	for (i = 0; i < 255; i++) {
		var r = i + ~~(random.nextFloat() * (256 - i));
		var aux = p[i];
		p[i] = p[r];
		p[r] = aux;
	}
	return p;
}
SimplexNoise._buildPermutationTable = buildPermutationTable;








export {
	Random as Random,
	SimplexNoise as Noise,
}