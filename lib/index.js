"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var child = require("child_process");

var fs = require("fs");

var pkg = require("../package.json");

var updateVersion = require("../utils/updateVersion");

var generateNewChangelog = require("../utils/generateNewChangelog");

var changelog = function changelog() {
  var latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0];
  var output = child.execSync("git log ".concat(latestTag, "..HEAD --format=%B%H----DELIMITER----")).toString("utf-8");
  var commitsArray = output.split("----DELIMITER----\n").map(function (commit) {
    var _commit$split = commit.split("\n"),
        _commit$split2 = _slicedToArray(_commit$split, 2),
        message = _commit$split2[0],
        sha = _commit$split2[1];

    return {
      sha: sha,
      message: message
    };
  }).filter(function (commit) {
    return Boolean(commit.sha);
  });
  var newVersion = updateVersion(pkg.version);
  pkg.version = String(newVersion);
  var currentChangelog = fs.readFileSync("./CHANGELOG.md", "utf-8");
  var newChangelog = "# ".concat(newVersion, " (").concat(new Date().toISOString().split("T")[0], ")\n\n");
  newChangelog = generateNewChangelog(commitsArray, newChangelog); // prepend the newChangelog to the current one

  fs.writeFileSync("./CHANGELOG.md", "".concat(newChangelog).concat(currentChangelog));
  fs.writeFileSync("../package.json", JSON.stringify(pkg, null, 2)); // create a new commit

  child.execSync('git add .');
  child.execSync("git commit -m \"chore: Bump to version ".concat(newVersion, "\"")); // tag the commit

  child.execSync("git tag -a -m \"Tag for version ".concat(newVersion, "\" v").concat(newVersion));
};

changelog();
