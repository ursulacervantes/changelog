const package = require("./package.json");

const features = [];
const chores = [];
const fix = [];
const build = [];
const ci = [];
const docs = [];
const style = [];
const refactor = [];
const perf = [];
const test = [];
const breaking = [];

const reposityURL = !!package.repository ? package.repository.url : '';

const generateMessage = (commit) => {
  const type = commit.message.match(/^(feature|feat|fix|chore|build|ci|docs|style|refactor|perf|test|BREAKING CHANGES)(\(.*?\))?/);
  const scope = !!type ? type[0].match(/\(([^]+)\)/) : '';

  const scopeMessage = !!scope ? `*${scope[0]}*:`: '';
  const typePrefix = !!type ? (!!scope ? type[1]+scope[0]+':' : type[1]+':') : '';

  return `* ${scopeMessage} ${commit.message.replace(typePrefix, "")} ([${commit.sha.substring(
    0,
    6
  )}](${reposityURL}/commit/${
    commit.sha
  }))\n`
};

const generateCommitArray = ( commitsArray ) => {
  commitsArray.forEach(commit => {
    if (commit.message.startsWith("feature") || commit.message.startsWith("feat")) {
      features.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("chore")) {
      chores.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("fix")) {
      fix.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("build")) {
      build.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("ci")) {
      ci.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("docs")) {
      docs.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("style")) {
      style.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("refactor")) {
      refactor.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("perf")) {
      perf.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("test")) {
      fitestx.push( generateMessage(commit) );
    }
    else if (commit.message.startsWith("BREAKING CHANGES")) {
      breaking.push( generateMessage(commit) );
    }
  });
};

const writeChangelog = (title, content, newChangelog) => {
  newChangelog += `## ${title}\n`;
  content.forEach(item => {
    newChangelog += item;
  });
  newChangelog += '\n';

  return newChangelog;
};

const generateChangelog = ( newChangelog ) => {
  if (breaking.length) {
    newChangelog = writeChangelog(`BREAKING CHANGES`, breaking, newChangelog);
  }

  if (features.length) {
    newChangelog = writeChangelog(`Features`, features, newChangelog);
  }

  if (chores.length) {
    newChangelog = writeChangelog(`Chores`, features, newChangelog);
  }

  if (fix.length) {
    newChangelog = writeChangelog(`Fixes`, fix, newChangelog);
  }

  if (build.length) {
    newChangelog = writeChangelog(`Build`, build, newChangelog);
  }

  if (ci.length) {
    newChangelog = writeChangelog(`CI`, ci, newChangelog);
  }

  if (docs.length) {
    newChangelog = writeChangelog(`Docs`, docs, newChangelog);
  }

  if (style.length) {
    newChangelog = writeChangelog(`Styles`, style, newChangelog);
  }

  if (refactor.length) {
    newChangelog = writeChangelog(`Refactors`, refactor, newChangelog);
  }

  if (perf.length) {
    newChangelog = writeChangelog(`Performance`, perf, newChangelog);
  }

  if (test.length) {
    newChangelog = writeChangelog(`Tests`, test, newChangelog);
  }
  return newChangelog;
};

const generateNewChangelog = ( commitsArray, newChangelog ) => {
  generateCommitArray( commitsArray );
  return generateChangelog(newChangelog);
};

module.exports = generateNewChangelog;
