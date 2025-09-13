#!/usr/bin/env node

const express = require('express');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .option('i', {
    alias: 'input',
    describe: 'Path to the DBML file',
    type: 'string',
    demandOption: true,
  })
  .help()
  .argv;

const app = express();
const port = 1234;

const dbmlFilePath = path.resolve(argv.input);

if (!fs.existsSync(dbmlFilePath)) {
  console.error(`Error: Input file not found at ${dbmlFilePath}`);
  process.exit(1);
}

const dbmlContent = fs.readFileSync(dbmlFilePath, 'utf-8');

// Serve the bundled webview.js from the dist directory
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DBML Preview</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        #root {
          width: 100vw;
          height: 100vh;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.initialContent = ${JSON.stringify(dbmlContent)};
        window.filePath = ${JSON.stringify(dbmlFilePath)};
      </script>
      <script src="/webview.js"></script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`DBML Previewer is running at http://localhost:${port}`);
  console.log(`Serving DBML file from: ${dbmlFilePath}`);
});
