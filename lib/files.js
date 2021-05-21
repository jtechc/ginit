// Acquire current directory and look for .git
import fs from 'fs';
import path from 'path';
// const fs = require('fs');
// const path = require('path');


export function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
};

export function directoryExists(filePath) {
  return fs.existsSync(filePath);
}

  // module.exports = {
  //   getCurrentDirectoryBase,
  //   directoryExists
  // }
