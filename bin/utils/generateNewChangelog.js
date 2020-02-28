#!/usr/bin/env node
"use strict";

var pkg = require("../../package.json");

var features = [];
var chores = [];
var fix = [];
var build = [];
var ci = [];
var docs = [];
var style = [];
var refactor = [];
var perf = [];
var test = [];
var breaking = [];
var reposityURL = !!pkg.repository ? pkg.repository.url : '';

var generateMessage = function generateMessage(commit) {
  var type = commit.message.match(/^(feature|feat|fix|chore|build|ci|docs|style|refactor|perf|test|BREAKING CHANGES)(\(.*?\))?/);
  var scope = !!type ? type[0].match(/\(([^]+)\)/) : '';
  var scopeMessage = !!scope ? "*".concat(scope[0], "*:") : '';
  var typePrefix = !!type ? !!scope ? type[1] + scope[0] + ':' : type[1] + ':' : '';
  return "* ".concat(scopeMessage, " ").concat(commit.message.replace(typePrefix, ""), " ([").concat(commit.sha.substring(0, 6), "](").concat(reposityURL, "/commit/").concat(commit.sha, "))\n");
};

var generateCommitArray = function generateCommitArray(commitsArray) {
  commitsArray.forEach(function (commit) {
    if (commit.message.startsWith("feature") || commit.message.startsWith("feat")) {
      features.push(generateMessage(commit));
    } else if (commit.message.startsWith("chore")) {
      chores.push(generateMessage(commit));
    } else if (commit.message.startsWith("fix")) {
      fix.push(generateMessage(commit));
    } else if (commit.message.startsWith("build")) {
      build.push(generateMessage(commit));
    } else if (commit.message.startsWith("ci")) {
      ci.push(generateMessage(commit));
    } else if (commit.message.startsWith("docs")) {
      docs.push(generateMessage(commit));
    } else if (commit.message.startsWith("style")) {
      style.push(generateMessage(commit));
    } else if (commit.message.startsWith("refactor")) {
      refactor.push(generateMessage(commit));
    } else if (commit.message.startsWith("perf")) {
      perf.push(generateMessage(commit));
    } else if (commit.message.startsWith("test")) {
      fitestx.push(generateMessage(commit));
    } else if (commit.message.startsWith("BREAKING CHANGES")) {
      breaking.push(generateMessage(commit));
    }
  });
};

var writeChangelog = function writeChangelog(title, content, newChangelog) {
  newChangelog += "## ".concat(title, "\n");
  content.forEach(function (item) {
    newChangelog += item;
  });
  newChangelog += '\n';
  return newChangelog;
};

var generateChangelog = function generateChangelog(newChangelog) {
  if (breaking.length) {
    newChangelog = writeChangelog("BREAKING CHANGES", breaking, newChangelog);
  }

  if (features.length) {
    newChangelog = writeChangelog("Features", features, newChangelog);
  }

  if (chores.length) {
    newChangelog = writeChangelog("Chores", features, newChangelog);
  }

  if (fix.length) {
    newChangelog = writeChangelog("Fixes", fix, newChangelog);
  }

  if (build.length) {
    newChangelog = writeChangelog("Build", build, newChangelog);
  }

  if (ci.length) {
    newChangelog = writeChangelog("CI", ci, newChangelog);
  }

  if (docs.length) {
    newChangelog = writeChangelog("Docs", docs, newChangelog);
  }

  if (style.length) {
    newChangelog = writeChangelog("Styles", style, newChangelog);
  }

  if (refactor.length) {
    newChangelog = writeChangelog("Refactors", refactor, newChangelog);
  }

  if (perf.length) {
    newChangelog = writeChangelog("Performance", perf, newChangelog);
  }

  if (test.length) {
    newChangelog = writeChangelog("Tests", test, newChangelog);
  }

  return newChangelog;
};

var generateNewChangelog = function generateNewChangelog(commitsArray, newChangelog) {
  generateCommitArray(commitsArray);
  return generateChangelog(newChangelog);
};

module.exports = generateNewChangelog;