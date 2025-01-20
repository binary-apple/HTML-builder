const { mkdir, readdir, rm, copyFile } = require('fs/promises');
const { resolve } = require('path');
const { stdout } = require('process');

const FOLDER_FROM = 'files';
const FOLDER_TO = 'files-copy';

const copyDirectory = async (folderFrom, folderTo) => {
  try {
    await rm(folderTo, { force: true, recursive: true });
    await mkdir(resolve(folderTo));
    const files = await readdir(folderFrom, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        copyFile(resolve(folderFrom, file.name), resolve(folderTo, file.name));
      } else {
        copyDirectory(
          resolve(folderFrom, file.name),
          resolve(folderTo, file.name),
        );
      }
    }
  } catch (err) {
    stdout.write(`Error: ${err.message}`);
  }
};

copyDirectory(resolve(__dirname, FOLDER_FROM), resolve(__dirname, FOLDER_TO));

module.exports = copyDirectory;
