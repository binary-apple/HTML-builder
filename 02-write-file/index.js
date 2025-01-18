const { createWriteStream } = require('fs');
const { resolve } = require('path');
const { stdin, stdout } = require('process');

const DEST_FILE = 'text.txt';

const writeFile = () => {
  const outStream = createWriteStream(resolve(__dirname, DEST_FILE));
  stdout.write(
    `Hello! Type somethimg, press 'Enter' and see the result in ${DEST_FILE}\n`,
  );

  stdin.on('data', (data) => {
    if (data == 'exit\r\n' || data == 'exit\n' || data == 'exit\r') {
      process.emit('SIGINT');
    }
    outStream.write(data);
  });

  process.on('SIGINT', () => {
    console.log('Thank you! Bye!');
    process.exit();
  });
};

writeFile();
