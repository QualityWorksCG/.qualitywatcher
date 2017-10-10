import request from 'request';
import should from 'should';
import sinon from 'sinon';
import index from '../lib/index';
import setup from '../lib/setup';
import {expect} from 'chai';
import supertest from 'supertest';
import getData from '../lib/getData';
import sendToQualitywatcher from '../lib/sendToQualitywatcher';

var api = supertest(process.env.QUALITYWATCHER_ENDPOINT_ROOT || "http://app.qualitywatcher.com");

describe("Sending to QualityWatcher Test", function () {
	var host;
	beforeEach(function () {
		host = process.env.QUALITYWATCHER_ENDPOINT || "http://app.qualitywatcher.com/tests";
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
		this.timeout(15000);
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

	it("should test the sendToQualitywatcher function", function (done) {

		var gitData = {
			run_at: '2016-07-11T21:56:50.621Z',
			repo_token: 12345,
      service_name: 'local',
      domain_name: 'test',
			git:
			{
				head:
				{
					id: '1',
					author_name: 'Quality Tester',
					author_email: '',
					committer_name: 'Quality Tester',
					committer_email: '',
					message: ''
				},
				branch: 'master',
				remotes: [[]]
			}
		}

		var data = {
			results: {},
      currentOptions: gitData
		};
		sendToQualitywatcher(data, function(err, data){
			expect(err.detail.statusCode).to.be.equal(500);
			expect(data).to.be.null;
			done();
		})
	});
});

