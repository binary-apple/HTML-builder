const { createReadStream } = require('fs');
const { resolve } = require('path');
const { stdout } = require('process');

const SOURCE_FILE = 'text.txt';

const readFile = () => {
  const inStream = createReadStream(resolve(__dirname, SOURCE_FILE), 'utf-8');
  inStream.pipe(stdout);

  inStream.on('error', (err) =>
    stdout.write(`Error reading from ${SOURCE_FILE}: ${err.message}`),
  );

  stdout.on('error', (err) =>
    stdout.write(`Error writing to stdout: ${err.message}`),
  );
};

readFile();
