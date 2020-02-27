const child = require("child_process");
const fs = require("fs");
const package = require("./package.json");

const updateVersion = require("./updateVersion");
const generateNewChangelog = require("./generateNewChangelog");

const changelog = () => {
  const latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0];
  const output = child
    .execSync(`git log ${latestTag}..HEAD --format=%B%H----DELIMITER----`)
    .toString("utf-8");

  const commitsArray = output
    .split("----DELIMITER----\n")
    .map(commit => {
      const [message, sha] = commit.split("\n");

      return { sha, message };
    })
    .filter(commit => Boolean(commit.sha));

  const newVersion = updateVersion( package.version );
  package.version = String(newVersion);

  const currentChangelog = fs.readFileSync("./CHANGELOG.md", "utf-8");
  let newChangelog = `# ${newVersion} (${
    new Date().toISOString().split("T")[0]
  })\n\n`;

  newChangelog = generateNewChangelog(commitsArray, newChangelog);

  // prepend the newChangelog to the current one
  fs.writeFileSync("./CHANGELOG.md", `${newChangelog}${currentChangelog}`);


  fs.writeFileSync("./package.json", JSON.stringify(package, null, 2));

  // create a new commit
  child.execSync('git add .');
  child.execSync(`git commit -m "chore: Bump to version ${newVersion}"`);

  // tag the commit
  child.execSync(`git tag -a -m "Tag for version ${newVersion}" v${newVersion}`);
}

changelog();
