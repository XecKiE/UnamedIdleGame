const build = require(__dirname+'/Buildings.js')

const map = {
	'BUILD': {
		'TAVERNE': build.constructTaverne,
	},
	'GET': {
		
	}

};

exports.parse = async (socket_data) => {
	var data = JSON.parse(socket_data);
	console.log(data);
	console.log(data.action);
	console.log(data.action.split(' '));
	return data.action.split(' ').reduce((a, b) => a[b], map)(data.options);
};