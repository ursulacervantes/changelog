#!/usr/bin/env node

const argv = require('yargs').argv

const releaseAs = argv['release-as'];

const updateVersion = ( currentVersion ) => {
  let versioning = currentVersion.split('.').map( Number );
  let newVersion = currentVersion;

  versioning[0] = !!versioning[0] ?  versioning[0] : 0;
  versioning[1] = !!versioning[1] ?  versioning[1] : 0;
  versioning[2] = !!versioning[2] ?  versioning[2] : 0;

  switch(releaseAs) {
    case 'major':
      versioning[0] = versioning[0] + 1;
      versioning[1] = 0;
      versioning[2] = 0;
      newVersion = versioning.join('.');
      break;
    case 'minor':
      versioning[1] = versioning[1] + 1;
      versioning[2] = 0;
      newVersion = versioning.join('.');
      break;
    case 'patch':
      versioning[2] = versioning[2] + 1;
      newVersion = versioning.join('.');
      break;
    default:
      newVersion = typeof(releaseAs)=== 'string' ? releaseAs : currentVersion;
      break;
  }

  return newVersion;
};

module.exports = updateVersion;
