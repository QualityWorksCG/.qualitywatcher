#!/usr/bin/env node
import sendToQualitywatcher from '../sendToQualityWatcher';
import setup from '../dist/setup';

setup.getConfigData(function(err, data){
  if(err){
    //dont continue...
    throw err;
  }
  else{
    //console.log(data);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var input = '';

    process.stdin.on('data', function(chunk) {
      if(data.qualitywatcher_config.output_on_console){
        console.log(chunk);
      }
      input += chunk;
    });

    process.stdin.on('end', function() {
        sendToQualitywatcher(input, function(err,data) {
          if (err) {
            console.log("There was an error sending data to qualitywatcher app. \n\n");
            console.log(err.detail.body.err);
          }else{
            console.log(data.msg);
          }
        });
    });
  }
});