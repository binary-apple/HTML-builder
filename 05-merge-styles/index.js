const { readdir, readFile, writeFile } = require('fs/promises');
const { resolve, extname } = require('path');

const STYLES_FOLDER = 'styles';
const RESULT_FILE = 'project-dist/bundle.css';

const mergeStyles = async () => {
  const fullFolderPath = resolve(__dirname, STYLES_FOLDER);
  const files = await readdir(fullFolderPath, {
    withFileTypes: true,
  });
  const styles = [];
  for (const file of files) {
    if (file.isFile() && extname(file.name) === '.css') {
      const styleData = await readFile(resolve(fullFolderPath, file.name), {
        encoding: 'utf8',
      });
      styles.push(styleData);
    }
  }
  await writeFile(resolve(__dirname, RESULT_FILE), styles.join('\n'));
};

mergeStyles();
