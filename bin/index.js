#!/usr/bin/env node
'use strict';

var { readFile, writeFile } = require('fs/promises');
var path = require("path");
var { default: srtParser2 } = require("../dist/src/index");
var yargs = require('yargs/yargs');
var { hideBin } = require('yargs/helpers');
var argv = yargs(hideBin(process.argv)).argv;

var inputFilename = argv.i || argv.input;
var outputFilename = path.resolve(argv.o || argv.output || "output.json");
var parser = new srtParser2();
var minify = !!argv.minify;

if(!inputFilename) {
  throw new Error("Input filename is required. Please use the -i or --input flag")
}

try {
  readFile(path.resolve(inputFilename)).then(function (fileContents) {
    const result = parser.fromSrt(fileContents.toString());
    writeFile(outputFilename, Buffer.from(JSON.stringify(result, null, minify ? null : 2)), { flag: 'w' }).then(function() {
      console.log("Successfully parsed and wrote to " + outputFilename);
    }).catch(function(err) {
      console.error("There was a problem writing to file");
      console.error(err);
    });
  });
} catch (err) {
  console.error("Error reading from input file");
  console.error(err);
}
