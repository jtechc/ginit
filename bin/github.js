import Ora from 'ora';
import fs from 'fs';
import Conf from 'conf';
import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const name = pkg.name;

const conf = new Conf(name);
import { askGitHubCredentials } from './inquirer.js';

let octokit;

export function getInstance() {
  return octokit;
};

export function getStoredGitHubToken() {
  return conf.get('github.token');
};

export function gitHubAuth(token) {
  octokit = new Octokit({
    auth: token
  });
};

export async function getPersonalAccessToken() {
  const credentials = await askGitHubCredentials();
  const spinner = new Ora({
    text: 'Fetching information...',
    spinner: 'pipe',
    color: 'cyan'
  });

  spinner.start();

  const auth = createTokenAuth(credentials.personalAccessToken);

  try {
    const res = await auth();
    if (res.token) {
      conf.set('github.token', res.token);
      return res.token;
    } else {
      throw new Error("Github token was not found in the response.");
    }
  }
  finally {
    spinner.stop();
  }
};
