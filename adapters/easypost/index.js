require('babel-polyfill');
const Easypost = require('@easypost/api');

require('dotenv').config();

const createRequest = (input, callback) => {
    const api = new Easypost(process.env.API_KEY);
    const code = input.data.code || "";
    const car = input.data.car || "";

    const tracker = new api.Tracker({
      tracking_code: code,
      carrier: car,
    });

    tracker.save().then(result => {
		callback(200, {
			jobRunID: input.id,
			data: result,
			statusCode: 200
		});
    }).catch(result => {
		callback(500, {
			jobRunID: input.id,
			status: "errored",
			error: result,
			statusCode: 500
		});
    });
};

exports.gcpservice = (req, res) => {
	createRequest(req.body, (statusCode, data) => {
		res.status(statusCode).send(data);
	});
};

exports.handler = (event, context, callback) => {
	createRequest(event, (statusCode, data) => {
		callback(null, data);
	});
};

exports.handlerv2 = (event, context, callback) => {
	createRequest(JSON.parse(event.body), (statusCode, data) => {
		callback(null, {
			statusCode: statusCode,
			body: JSON.stringify(data),
			isBase64Encoded: false
		});
	});
};

module.exports.createRequest = createRequest;