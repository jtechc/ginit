import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { directoryExists } from './lib/files.js';
import { getStoredGitHubToken, getPersonalAccessToken, gitHubAuth } from './lib/github.js';
import { createRemoteRepo, createGitIgnore, setupRepo } from './lib/repo.js';

/*const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const touch = require('touch');
const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');
const inquirer = require('./lib/inquirer');
*/
clear();

console.log(
  chalk.cyanBright(
    figlet.textSync('Ginit Revamped', { horizontalLayout: 'full' })
  )
);

if (directoryExists('.git')) {
  console.log(chalk.red('Already a git repository here!'));
  process.exit();
}

const getGitHubToken = async () => {
  let token = getStoredGitHubToken();
  if (token) {
    return token;
  }
  token = await getPersonalAccessToken();

  return token;
};

const run = async () => {
  try {
    const token = await getGitHubToken();
    gitHubAuth(token);

    const url = await createRemoteRepo();
    await createGitIgnore();
    await setupRepo(url);

    console.log(chalk.green('Finish!'));
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(chalk.red('Could\'t log you in.  Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('There is already a remote repository or token with the same name.'));
          break;
        default: console.log(chalk.red(err));
      }
    }
  }
};

run();