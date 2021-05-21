import Ora from 'ora';
import fs from 'fs';
import simpleGit from 'simple-git/promise.js';
import touch from 'touch';
import _ from 'lodash';
import { getInstance } from './github.js';
import { askRepoDetails, askIgnoreFiles } from './inquirer.js';
import { stdout, stderr } from 'process';

const git = simpleGit();

export async function createRemoteRepo() {
  const github = getInstance();
  const answers = await askRepoDetails();

  const data = {
    name: answers.name,
    description: answers.description,
    private: (answers.visibility === 'private')
  };

  const spinner = new Ora({
    color: 'cyan',
    text: 'Fetching information...',
    spinner: 'pipe'
  });
  spinner.start();

  try {
    const response = await github.repos.createForAuthenticatedUser(data);
    return response.data.ssh_url;
  } finally {
    spinner.stop();
  }


};
export async function createGitIgnore() {
  const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
  if (filelist.length) {
    const answers = await askIgnoreFiles(filelist);
    if (answers.ignore.length) {
      fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
    } else {
      touch('.gitignore');
    }
  } else touch('.gitignore');
};
export async function setupRepo(url) {
  const repoStatus = new Ora({
    color: 'cyan',
    text: 'Creating new repository...',
    spinner: 'pipe',
    stream: stdout
  });
  //repoStatus.start();

  try {
    await git.init();
    await git.add('.gitignore');
    await git.add('./*');
    await git.commit('Initial commit');
    await git.addRemote('origin', url);
    await git.push('origin', 'master');
  } catch (e) {
    await repoStatus.stop();
    fs.appendFileSync(log.txt, stderr);
    throw (e);
  } finally {
    repoStatus.stop();
  }
};
