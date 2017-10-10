import request from 'request';
import getData from './getData';
import dotenv from 'dotenv';
dotenv.config({ silent: true });

var sendToQualityWatcher = function (data, cb) {
  var url = '';

  getData.getCurrentOptions(function (err, currentOptions) {

    // Loading the qualitywatcher endpoint
    if (process.env.QUALITYWATCHER_ENDPOINT) {
      url = process.env.QUALITYWATCHER_ENDPOINT;
    } else {
      url = `http://${currentOptions.domain_name}.qualitywatcher.com/tests`;
    }

    // Creating an object to send to the qualitywatcher endpoint
    var options = {
      url: url,
      json: {
        results: data,
        currentOptions: currentOptions
      }
    };

    // Sending data in a post request
    request.post(options, function (err, response, body) {
      // console.log(options)
      if (err) {
        return cb(err, null);
      }
      if (response.statusCode !== 200) {
        var error = {};
        error.detail = {
          statusCode: response.statusCode,
          body: body,
          request: options
        };
        return cb(error, null);
      }
      return cb(null, body);
    });
  });
};

module.exports = sendToQualityWatcher;
