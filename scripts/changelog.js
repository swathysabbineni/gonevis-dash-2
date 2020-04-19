/**
 * Changelog command.
 *
 * Usage: npm run changelog CHANGE_TYPE ISSUE_ID TITLE
 *
 * To keep track of all the changes to be used for ChangeLog.md generation.
 * Should be used eeach time a task has been resolved.
 */
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

const change = { "title": title, "issueID": issueID, "changeType": changeType };

const changeLogFileName = `./changelogs/${changeType}-${issueID}-${slugify(title)}.json`;

if (fs.existsSync(changeLogFileName)) {

  var readline = require('readline');
  var rl = readline.createInterface(process.stdin, process.stdout);

  rl.setPrompt(`> "${changeLogFileName}" already exists, override ? (yes/no) [default:yes] `);
  rl.prompt();
  rl.on('line', function (line) {
    const answer = line.trim().toLowerCase();

    if (["yes", "y"].includes((answer))) {
      saveChanges(changeLogFileName, change);
    } else {
      console.info(`Not overriding the ${changeLogFileName}`);
    }

    rl.close();
  }).on('close', function () {
    process.exit(0);
  });

} else {
  saveChanges(changeLogFileName, change);
}


/**
 * Save Changes.
 *
 * @param {string} changeLogFileName File Path where changelog should be written.
 * @param {object} change Change object to be saved.
 */
function saveChanges(changeLogFileName, change) {
  fs.writeFileSync(changeLogFileName, JSON.stringify(change));
  console.info(`Changelog written to ${changeLogFileName}`);
}
