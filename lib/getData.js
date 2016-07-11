var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var appRoot = require('app-root-path');
var exec = require('child_process').exec;

/**
  Regular Expressions
**/

var REGEX_COMMIT_DETAILS = /\nauthor (.+?) <(.+?)>.+\ncommitter (.+?) <(.+?)>.+[\S\s]*?\n\n(.*)/m;

/**
  Modules
**/

var getCurrentOptions = function(cb){
  var options = {};
  var git_commit = null;
  var git_branch = null;

  options.run_at = JSON.stringify(new Date()).slice(1, -1);

  if (!git_commit || !git_branch) {
    var data = require('./localGit')(git_commit, git_branch);
    if (data) {
      git_commit = git_commit || data.git_commit;
      git_branch = git_branch || data.git_branch;
    }
  }

  var yml = path.join(appRoot.path, '.qualitywatcher.yml');
  try {
    if (fs.statSync(yml).isFile()) {
      var qualitywatcher_yaml_conf = yaml.safeLoad(fs.readFileSync(yml, 'utf8'));
      options.repo_token = qualitywatcher_yaml_conf.repo_token;
      if(qualitywatcher_yaml_conf.service_name) {
          options.service_name = qualitywatcher_yaml_conf.service_name;
        }
      }
    } catch(ex){
      console.log("'qualitywatcher.yml' file is missing, are you sure it is in the root of your project ?");
    }

  if (git_commit){
    gitData({
      head: {
        id: git_commit
      },
      branch: git_branch
    }, function(err, git){
      if (err){
        console.log('error getting git data: ', err);
      } else {
        options.git = git;
      }
      return cb(err, options);
    });
  } else {
    return cb(null, options);
  }
};

var fecthOptions = function(cb){
  if (!cb){
    throw new Error('fecthOptions requires a callback');
  }

  getCurrentOptions(function(err, options){
    // try to get filepath from the command-line
    if (process.argv[2]) {
      if (~['-v', '--verbose'].indexOf(process.argv[2])) {
        if (process.argv[3]) {
          options.filepath = process.argv[3];
        }
      } else {
        options.filepath = process.argv[2];
      }
    }
      cb(err, options);
  });
};

function gitData(git, cb) {
  if (!cb){
    throw new Error("gitData requires a callback");
  }

  if ('undefined' === typeof git) {
    return cb(new Error('No options passed'));
  }
  if (!git.hasOwnProperty('head')) {
    return cb(new Error('You must provide the head'));
  }
  if (!git.head.hasOwnProperty('id')) {
    return cb(new Error('You must provide the head.id'));
  }

  if (!git.hasOwnProperty("branch")) {
    git.branch = "";
  }
  if (!git.hasOwnProperty("remotes")) {
    git.remotes = [];
  }

  if ("string" !== typeof git.branch) {
    git.branch = "";
  }
  if (!(git.remotes instanceof Array)) {
    git.remotes = [];
  }

  exec("git rev-parse --verify " + git.head.id, function(err, response){
    if (err){
      git.head.author_name = git.head.author_name || "Unknown Author";
      git.head.author_email = git.head.author_email || "";
      git.head.committer_name = git.head.committer_name || "Unknown Committer";
      git.head.committer_email = git.head.committer_email || "";
      git.head.message = git.head.message || "Unknown Commit Message";
      return cb(null, git);
    }

    fetchHeadDetails(git, cb);
  });
}

function fetchBranch(git, cb) {
  exec("git branch", function(err, branches){
    if (err)
      return cb(err);

    git.branch = (branches.match(/^\* (\w+)/) || [])[1];
    fetchRemotes(git, cb);
  });
}

function fetchHeadDetails(git, cb) {
  exec('git cat-file -p ' + git.head.id, function(err, response) {
    if (err)
      return cb(err);

    var items = response.match(REGEX_COMMIT_DETAILS).slice(1);
    var fields = ['author_name', 'author_email', 'committer_name', 'committer_email', 'message'];
    fields.forEach(function(field, index) {
      git.head[field] = items[index];
    });

    if (git.branch) {
      fetchRemotes(git, cb);
    } else {
      fetchBranch(git, cb);
    }
  });
}

function fetchRemotes(git, cb) {
  exec("git remote -v", function(err, remotes){
    if (err)
      return cb(err);

    var processed = {};
    remotes.split("\n").forEach(function(remote) {
      if (!/\s\(push\)$/.test(remote))
        return;
      remote = remote.split(/\s+/);
      saveRemote(processed, git, remote[0], remote[1]);
    });
    cb(null, git);
  });
}

function saveRemote(processed, git, name, url) {
  var key = name + "-" + url;
  if (processed.hasOwnProperty(key))
    return;

  processed[key] = true;
  git.remotes.push({ name: name, url: url });
}

module.exports = gitData;
module.exports.getCurrentOptions = getCurrentOptions;
module.exports.fecthOptions = fecthOptions;