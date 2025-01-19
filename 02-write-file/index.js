const { createWriteStream } = require('fs');
const { resolve } = require('path');
const { stdin, stdout } = require('process');
const readline = require('readline');

const DEST_FILE = 'text.txt';

const writeFile = () => {
  const outStream = createWriteStream(resolve(__dirname, DEST_FILE));
  stdout.write(
    `Hello! Type somethimg, press 'Enter' and see the result in ${DEST_FILE}\n`,
  );

  const rl = readline.createInterface({ input: stdin, output: outStream });

  rl.on('line', (line) => {
    if (line === 'exit') {
      process.emit('SIGINT');
    }
    outStream.write(line + '\n');
  });

  process.on('SIGINT', () => {
    rl.close();
    stdout.write('Thank you! Bye!');
    process.exit();
  });
};

writeFile();
