const { readdir, stat } = require('fs/promises');
const { resolve, basename, extname } = require('path');
const { stdout } = process;

const FOLDER_NAME = 'secret-folder';

const listFolderData = async () => {
  try {
    const files = await readdir(resolve(__dirname, FOLDER_NAME), {
      withFileTypes: true,
    });

    for (const file of files) {
      const fileStat = await stat(resolve(__dirname, FOLDER_NAME, file.name));
      if (!fileStat.isFile()) {
        continue;
      }
      const fileType = extname(file.name);
      stdout.write(
        `${basename(file.name, fileType)} - ${fileType.slice(1)} - ${Math.ceil(
          fileStat.size / 1024,
        )}kb\n`,
      );
    }
  } catch (err) {
    stdout.write(`Error: ${err.message}`);
  }
};

listFolderData();
