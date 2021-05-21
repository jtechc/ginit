import inquirer from 'inquirer';
import { getCurrentDirectoryBase } from './files.js';
import terminalLink from 'terminal-link';
import c from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;


export function askGitHubCredentials() {
  const link = terminalLink(c.yellow('Basic authentication is deprecated!'), 'https://docs.github.com/en/rest/overview/troubleshooting#basic-authentication-errors');
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: `\nPlease enter your GitHub username or email address:`,
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or email address.';
        }
      }
    },
    {
      name: 'personalAccessToken',
      type: 'password',
      message: `${link}\n\nPlease generate a personal access token for login.` +
        `\nEnter it here:`,
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your personal access token.';
        }
      }
    }
  ];
  return inquirer.prompt(questions);
};
export function askRepoDetails() {
  // let argv = 'minimist';
  // (process.argv.slice(2));
  // //const argv = require('minimist')(process.argv.slice(2));

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for the repository:',
      default: argv._[0] || getCurrentDirectoryBase(),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a name for the repository.';
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      default: argv._[1] || null,
      message: 'Optionally enter a description of the repository:'
    },
    {
      type: 'list',
      name: 'visibility',
      message: 'Public or private:',
      choices: ['public', 'private'],
      default: 'public'
    }
  ];
  return inquirer.prompt(questions);
}
export function askIgnoreFiles(filelist) {
  const questions = [
    {
      type: 'checkbox',
      name: 'ignore',
      message: 'Select the files and/or folders you wish to ignore:',
      choices: filelist,
      default: ['node_modules', 'bower_contents']
    }
  ];
  return inquirer.prompt(questions);
};
