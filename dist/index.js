#!/usr/bin/env node
import fs from 'fs';
import { exec, spawn } from 'child_process';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import * as fileContent from './fileContent.js';
let projectName = '';
let projectDirectory = '';
const askProjectName = async () => {
    const answers = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: 'Project Name?',
    });
    projectName = answers.projectName;
};
const executeCommand = (command, args, executionDirectory) => new Promise(resolve => {
    const child = spawn(command, args, { cwd: executionDirectory });
    // child.stdout.on('data', d => console.log(d.toString()))
    // child.stderr.on('data', d => console.log(d.toString()))
    child.on('close', () => {
        resolve();
    });
});
const installNodeDependencies = async () => {
    const spinner = createSpinner('Installing dependencies...').start();
    await executeCommand('npm', ['init', '-y'], projectDirectory);
    await executeCommand('npm', ['i', 'express', 'tsx', 'typescript'], projectDirectory);
    await executeCommand('npm', [
        'i',
        '-D',
        '@types/node',
        '@types/express',
        'eslint',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-config-airbnb-typescript',
    ], projectDirectory);
    await executeCommand('npx', ['--yes', 'install-peerdeps', '--dev', 'eslint-config-airbnb'], projectDirectory);
    spinner.success();
};
const addConfigurationFiles = () => {
    const spinner = createSpinner('Adding configuration files ...').start();
    exec('node -v', (err, nodeVersion) => {
        if (!err) {
            fs.writeFileSync(`${projectDirectory}/.nvmrc`, nodeVersion.replace('v', ''));
        }
    });
    fs.writeFileSync(`${projectDirectory}/.gitignore`, fileContent.gitIgnore());
    fs.writeFileSync(`${projectDirectory}/.prettierrc`, fileContent.prettierrc());
    fs.writeFileSync(`${projectDirectory}/.eslintrc.json`, fileContent.eslint());
    fs.writeFileSync(`${projectDirectory}/README.md`, fileContent.readme(projectName));
    fs.writeFileSync(`${projectDirectory}/tsconfig.json`, fileContent.tsConfig());
    fs.mkdirSync(`${projectDirectory}/src`);
    fs.writeFileSync(`${projectDirectory}/src/server.ts`, fileContent.serverTs());
    fs.writeFileSync(`${projectDirectory}/src/index.html`, fileContent.indexHtml(projectName));
    const packageJson = JSON.parse(fs.readFileSync(`${projectDirectory}/package.json`, { encoding: 'utf8', flag: 'r' }));
    packageJson.scripts = {
        start: 'tsx src/server.ts',
    };
    packageJson.type = 'module';
    fs.writeFileSync(`${projectDirectory}/package.json`, JSON.stringify(packageJson, null, 2));
    spinner.success();
};
const initializeGit = async (directory) => {
    const spinner = createSpinner('Initializing git...').start();
    await executeCommand('git', ['init'], directory);
    await executeCommand('git', ['add', '-A'], directory);
    await executeCommand('git', ['commit', '-m', 'initializing project with raise-the-bones'], directory);
    spinner.success();
};
console.log(gradient('#666', '#FFF', '#666')('RAISE THE BONES!'));
await askProjectName();
projectDirectory = `${process.cwd()}/${projectName}`;
if (projectName && !fs.existsSync(projectName)) {
    fs.mkdirSync(projectDirectory);
    await installNodeDependencies();
    addConfigurationFiles();
    await initializeGit(projectDirectory);
}
