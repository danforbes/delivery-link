const assert = require('chai').assert;
const createRequest = require('../index.js').createRequest;

describe('createRequest', () => {

	context('when requesting shipping data', () => {
		const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
		const req = {
			id: jobID,
			data: {
				code: "EZ1000000001",
				car: "USPS"
			}
		};

		it('returns data to the node', (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				done();
				});
			});
		});

	context('when requesting invalid data', t => {
		const jobID = "278c97ffadb54a5bbb93cfec5f7b5504";
		const req = {
			id: jobID,
			data: {
				code: "notreal",
				car: "notreal"
			}
		};

		it('returns an error to the node', (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 500);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.error);
				done();
			});
		});
	});
});