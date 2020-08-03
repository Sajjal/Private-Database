const child_process = require("child_process");
const fs = require("fs");

async function backup() {
  try {
    child_process.execSync(`zip -r ./backup/data.zip ./data`, {
      cwd: `./`,
    });
    return;
  } catch {
    return;
  }
}

async function restoreBackup() {
  try {
    child_process.execSync(`unzip -o -d ./ ./backup/data.zip`, {
      cwd: `./`,
    });
    return;
  } catch {
    return;
  }
}

async function deleteBackup() {
  try {
    fs.unlink(`./backup/data.zip`, (err) => {
      if (err) {
        return;
      }
    });
    return;
  } catch {
    return;
  }
}

async function createBackup() {
  await deleteBackup();
  await backup();
  return;
}

module.exports = { createBackup, restoreBackup };
