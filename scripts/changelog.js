const fs = require("fs");
const slugify = require("./core/slugify");

args = process.argv.slice(2);

if (args.length < 3) {
  console.error("Usage: npm run changelog CHANGE_TYPE ISSUE_ID TITLE");
  return;
}

const ALLOWED_CHANGE_TYPES = ["fix", "feature", "security", "improvement"];

const changeType = args[0].toLowerCase();
const issueID = args[1];
const title = args[2];

if (!ALLOWED_CHANGE_TYPES.includes(changeType)) {
  console.error("Change Type could be one of the: ", ALLOWED_CHANGE_TYPES);
  return;
}

const change = {"title": title, "issueID": issueID, "changeType": changeType};

const changeLogFileName = `./changelogs/${changeType}-${issueID}-${slugify(title)}.json`;
fs.writeFileSync(changeLogFileName, JSON.stringify(change));

console.log(`Changelog written to ${changeLogFileName}`);
