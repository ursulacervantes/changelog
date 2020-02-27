
const argv = require('yargs').argv

const updateVersion = require("./updateVersion");

const newVersion = updateVersion("1.2.3");

console.log(newVersion)
