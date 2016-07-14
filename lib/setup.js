import path from 'path';
import fs  from 'fs';
import appRoot from 'app-root-path';
import jsonfile from 'jsonfile';

var getConfigData = function(cb){

	var nightwatchJsonPath = "";
	var data               = {};
	
	//We first look in the project root to find the nightwatch.json file
	fs.stat(path.join(appRoot.path, 'nightwatch.json'), function(err, stats){
		if(err){
			//if there was an error, the file probably doesnt exist, so lets
			//check in the nightwatch bin folder for the config file
            
			fs.stat(path.join(appRoot.path, 'node_modules','nightwatch','bin','nightwatch.json'), function(err, stats){
				if(err){
                    console.log(err);
					cb(err,null);
				}
				else
				{
					data.path = path.join(appRoot.path, 'node_modules','nightwatch','bin', 'nightwatch.json');

					jsonfile.readFile(data.path, function(err, obj){
						if(err){
                            console.log(err);
							cb(err,null);
						}
						else
						{
							if(obj.qualitywatcher_config === undefined){
								cb(" 'qualitywatcher_config' property doesnt exist in nightwatch file at " + data.path, null);
							}
							else{
								data.qualitywatcher_config = obj.qualitywatcher_config;
								cb(null, data);
							}
						}
					});
				}
			});
		}
		else
		{
			data.path = path.join(appRoot.path, 'nightwatch.json');

			jsonfile.readFile(data.path, function(err, obj){
				if(err){
                    console.log(err);
					cb(err,null);
				}
				else
				{
					if(obj.qualitywatcher_config === undefined){
                        console.log("'qualitywatcher_config' property doesnt exist in nightwatch file at " + data.path);
						cb(" 'qualitywatcher_config' property doesnt exist in nightwatch file at " + data.path, null);
					}
					else{
						data.qualitywatcher_config = obj.qualitywatcher_config;
						cb(null, data);
					}
				}
			});
		}
	});
};

exports.getConfigData = getConfigData;