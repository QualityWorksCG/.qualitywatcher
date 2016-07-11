
var request = require('request');
var should = require('should');
var sinon = require('sinon');
var index = require('../index');
var setup = require('../lib/setup');
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest("http://localhost:3001");
var getData = require('../lib/getData');

describe("Sending to QualityWatcher Test", function () {
	var host;
	beforeEach(function () {
		host = process.env.QUALITYWATCHER_ENDPOINT;
	});

	afterEach(function () {
		sinon.restore();
		if (host !== undefined) {
			process.env.QUALITYWATCHER_ENDPOINT = host;
		}
		else {
			delete process.env.QUALITYWATCHER_ENDPOINT;
		}
	});

	it("should get configuration", function (done) {
		setup.getConfigData(function (err, data) {
			expect(data).to.be.a('object');
			expect(data).not.to.be.equal(null);
			expect(data.path).to.contain('nightwatch.json');
			done();
		});
	});

	it("should interact with application", function (done) {
		getData.getCurrentOptions(function (err, gitData) {

			var data = {
				results: {},
				currentOptions: gitData
			};

			api.post('/tests')
				.type('form')
				.send(data)
				.expect(500)
				.end(function (err, res) {
					res.statusCode.should.equal(500)
					expect(res.body.err).to.contain("Project could not be located")
					done();
				});
		});
	});
});

