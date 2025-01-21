const {
  readFile,
  writeFile,
  rm,
  mkdir,
  readdir,
  copyFile,
} = require('fs/promises');
const { resolve, extname } = require('path');
const { stdout } = require('process');

const RESULT_FOLDER = resolve(__dirname, 'project-dist');
const STYLES_FOLDER = resolve(__dirname, 'styles');
const RESULT_FILE = 'project-dist/style.css';

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

const buildPage = async () => {
  await mkdir(RESULT_FOLDER);

  await copyDirectory(
    resolve(__dirname, 'assets'),
    resolve(__dirname, 'project-dist/assets'),
  );

  await mergeStyles();

  let template = await readFile(resolve(__dirname, 'template.html'), {
    encoding: 'utf8',
  });
  const regExpTag = new RegExp('{{[a-z]*}}', 'gi');
  const tags = [...template.matchAll(regExpTag)].map((tag) =>
    tag[0].slice(2, -2),
  );
  for (const tag of tags) {
    const component = await readFile(
      resolve(__dirname, 'components', `${tag}.html`),
      { encoding: 'utf8' },
    );
    template = template.replaceAll(`{{${tag}}}`, component);
  }
  await writeFile(resolve(RESULT_FOLDER, 'index.html'), template);
};

buildPage();
