
var sinon 		= require('sinon');
var getData 	= require('../lib/getData');
var expect 		= require('chai').expect;

describe("Testing getData feature - Valid", function(){
	var host;
	beforeEach(function(){
		host = process.env.NIGHTWATCHER_ENDPOINT;
	});
	
	afterEach(function(){
		sinon.restore();
		if(host !== undefined){
			process.env.NIGHTWATCHER_ENDPOINT = host;
		}
		else
		{
			delete process.env.NIGHTWATCHER_ENDPOINT;
		}
	});

	it("should get git and service data ",function(done){
		getData.getCurrentOptions(function(err,data){
			expect(data).to.be.a('object');
			expect(data).not.to.be.equal(null);
			expect(data).to.have.property('run_at');
			expect(data).to.have.property('repo_token');
			expect(data).to.have.property('service_name');
			expect(data).to.have.property('git');
			expect(data.git).to.have.property('head');
			expect(data.git).to.have.property('branch');
			expect(data.git).to.have.property('remotes');
			done();
		});
	});
});
