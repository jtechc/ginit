#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import CFonts from 'cfonts';
import { directoryExists } from './bin/files.js';
import { getStoredGitHubToken, getPersonalAccessToken, gitHubAuth } from './bin/github.js';
import { createRemoteRepo, createGitIgnore, setupRepo } from './bin/repo.js';

clear();

CFonts.say('Ginit|Revamped', {
  font: 'chrome',
  colors: ['cyanBright', 'cyan']
});

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