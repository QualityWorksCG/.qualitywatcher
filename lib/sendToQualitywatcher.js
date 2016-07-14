import request from 'request';
import getData from './getData';
import 'dotenv/config';

var sendToQualityWatcher = function(data, cb){
	var url="";

	//Loading the qualitywatcher endpoint
	if(process.env.QUALITYWATCHER_ENDPOINT){
		url = process.env.QUALITYWATCHER_ENDPOINT;
	}
	else{
		url = 'http://qualitywatcher.io';
	}

  	getData.getCurrentOptions(function(err,currentOptions){
		
		//Creating an object to send to the qualitywatcher endpoint
		var options = {
	    	url : url,
	    	json : {
	    		results : data,
				currentOptions : currentOptions
			}
  		};
		
  		//Sending data in a post request
  		request.post(options, function(err, response, body){
  			//console.log(options);
	    	if (err){
	      	return cb(err,null);
	    	}
	    	if (response.statusCode !== 200){
	      	var error = {};
	      		error.detail = {
	        	statusCode : response.statusCode,
	        	body : body,
	        	request : options
	      	};
	      		return cb(error,null);
	    	}
	    	return cb(null,body);
  		});

  	});
};

module.exports = sendToQualityWatcher;