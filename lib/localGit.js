import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';

var REGEX_BRANCH = /^ref: refs\/heads\/(\w+)$/;

module.exports = function localGit() {
  var dir = appRoot.path; 
  while (path.resolve('/') !== dir) {
    var gitDir = path.join(dir, '.git');
    var existsSync = fs.existsSync || path.existsSync;
    if (existsSync(path.join(gitDir, 'HEAD'))){
      break;
    }

    dir = path.dirname(dir);
  }

  if (path.resolve('/') === dir){
    return;
  }

  var head = fs.readFileSync(path.join(dir, '.git', 'HEAD'), 'utf-8').trim();
  var branch = (head.match(REGEX_BRANCH) || [])[1];
  if (!branch){
    return { git_commit: head };
  }

  var commit = fs.readFileSync(path.join(dir, '.git', 'refs', 'heads', branch), 'utf-8').trim();
  return { git_commit: commit, git_branch: branch };
};