const fs = require("fs");

const envFileName = 'src/environments/version.ts';

const today = new Date();
const VERSION = {
  CIRCLE_SHA1: process.env.CIRCLE_SHA1 || "tip",
  RELEASE_DATE: `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`
}

let fileTemplate = "export const VERSION = " + JSON.stringify(VERSION) + ";\n";

fileTemplate = fileTemplate
  .replace(/{"/gi, "{")
  .replace(/,"/gi, ", ")
  .replace(/":/gi, ": ")
  .replace(/"/gi, "'");

fs.writeFileSync(envFileName, fileTemplate);
