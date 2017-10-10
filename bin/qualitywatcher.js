#!/usr/bin/env node
import sendToQualitywatcher from '../sendToQualityWatcher';
import setup from '../setup';
import chalk  from 'chalk';
import clear from 'clear';
import CLI from 'clui';
import figlet from 'figlet';
import inquirer from 'inquirer';
var Spinner = CLI.Spinner;
import fs from 'fs';
import path from 'path';

var qualitywatcher = function () {

  //If the argument is less than 2, some properties were missing
  if (process.argv.length > 3 || process.argv.length < 2) {
    console.log(chalk.red('Usage: qualitywatcher [options] (qualitywatcher --help to display options)'));
  } else {

    //Parse only if arguments exceed 2
    if (process.argv.length > 2) {
      var config = _parseCommandArgs(process);

      if (config.err) {
        console.log(chalk.red('Usage: qualitywatcher expects either `--init/-i` or `--help/-h`'));
        process.exit();
      }
      else if (config.init) {
        var status = new Spinner('\nCreating qualitywatcher project structure, please wait...');
        //status.start();

        clear();
        console.log(chalk.cyan("-- 👀\tqualitywatcher.com project setup --\n"));

        inquirer.prompt([
          {
            name: 'repo_token',
            type: 'input',
            message: 'Enter your qualitywatcher.com repo token: ',
            validate: function (value) {
              var re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              var check = re.test(value);

              if (value.length && check) {
                return true;
              } else {
                return 'Please enter a valid repo token';
              }
            }
          },
          {
            name: 'script_name',
            type: 'input',
            message: 'What would you like your qualitywatcher.com script name to be: ',
            validate: function (value) {
              if (value.length) {
                return true;
              } else {
                return 'Please enter a valid script name';
              }
            }
          }
        ]).then(function (answers) {
          status.start();

          fs.writeFileSync('.qualitywatcher.yml', "repo_token: " + answers.repo_token);
          var path = process.cwd()+"/package.json";
          var packageJson = require(path);
          packageJson.scripts[answers.script_name] = "nightwatch | qualitywatcher"
          fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) , 'utf-8');

          status.stop();

          console.log(
            chalk.yellow(
              figlet.textSync('Done !', { horizontalLayout: 'full' })
            )
          );
          console.log(".qualitywatcher.yml file created. V2 will include gihub/bitbucket authentication and allow you to select your project and create your repo token.")
        })
      }
      else if (config.isHelp) {
        console.log("Help info...");
        process.exit();
      }
    }
    else {
      //In this scenario, we are accepting test results
      setup.getConfigData(function (err, data) {
        if (err) {
          //dont continue...
          throw err;
        }
        else {
          //console.log(data);
          process.stdin.resume();
          process.stdin.setEncoding('utf8');

          var input = '';

          process.stdin.on('data', function (chunk) {
            if (data.qualitywatcher_config.output_on_console) {
              console.log(chunk);
            }
            input += chunk;
          });

          process.stdin.on('end', function () {
            sendToQualitywatcher(input, function (err, data) {
              if (err) {
                console.log("There was an error sending data to qualitywatcher app. \n\n");
                if (err.detail) {
                  console.log(err.detail.body.err);
                } else {
                  console.log(err);
                }
              } else {
                console.log(data.msg);
              }
            });
          });
        }
      });

    }
  }
}

function _parseCommandArgs(process) {

  var config = {};
  config.isHelp = false;
  config.err = false;
  config.init = false;
  var _process = process;
  var argSize = _process.argv.length;

  //We ierate through the commands that were sent to do the correct process
  for (var i = 2; i < argSize; i++) {
    var arg = process.argv[i];
    //console.log(arg);
    switch (arg) {

      case "--help":
      case "-h":
        config.isHelp = true;
        break;

      case "--init":
      case "-i":
        config.init = true;
        break;

      default:
        config.err = true;
        break;
    }
  }

  return config;
}

var getCurrentDirectoryBase = function () {
  return path.basename(process.cwd());
}

var directoryExists = function (filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

qualitywatcher();