const build = require(__dirname+'/Buildings.js')

const map = {
	'BUILD': {
		'TAVERNE': build.constructTaverne,
	},
	'DESTRUCT': {

	},
	'GET': {

	},

};

exports.parse = async (socket_data) => {
	var data = JSON.parse(socket_data);
	console.log(data);
	console.log(data.action);
	console.log(data.action.split(' '));
	try {
		var result = await data.action.split(' ').reduce((a, b) => a[b], map)(data.options);
		var response = {
			status: 'success',
			data: result,
		};
		return JSON.stringify(response);
	}
	catch (err) {
		var response = {
			status: 'error',
			type: 'func_error',
			error: data.action+' does not exist',
		};
		return JSON.stringify(response);
	}

	return 
};