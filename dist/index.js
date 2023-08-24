#!/usr/bin/env node
import fs from 'fs';
import { exec, spawn } from 'child_process';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import * as fileContent from './fileContent.js';
let projectName = '';
let projectDirectory = '';
let deploy = false;
let region = '';
const askProjectName = async () => {
    const answers = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: 'Project Name?',
    });
    projectName = answers.projectName;
};
const askForFlyDeployment = async () => {
    const answers = await inquirer.prompt({
        name: 'deploy',
        type: 'list',
        message: 'Deploy to Fly.io?',
        choices: ['Yes', 'No'],
    });
    deploy = answers.deploy === 'Yes';
};
const askForFlyDeploymentRegion = async () => {
    const answers = await inquirer.prompt({
        name: 'region',
        type: 'list',
        message: 'Choose a region for deployment: ',
        choices: [
            'Amsterdam, Netherlands (ams)',
            'Stockholm, Sweden (arn)',
            'Atlanta, Georgia (US) (atl)',
            'Bogotá, Colombia (bog)',
            'Boston, Massachusetts (US) (bos)',
            'Paris, France (cdg)',
            'Denver, Colorado (US) (den)',
            'Dallas, Texas (US) (dfw)',
            'Secaucus, NJ (US) (ewr)',
            'Ezeiza, Argentina (eze)',
            'Guadalajara, Mexico (gdl)',
            'Rio de Janeiro, Brazil (gig)',
            'Sao Paulo, Brazil (gru)',
            'Hong Kong, Hong Kong (hkg)',
            'Ashburn, Virginia (US) (iad)',
        ],
    });
    region = answers.region.split(' ').slice(-1)[0].replace('(', '').replace(')', '');
    console.log(region);
};
const executeCommand = (command, args, executionDirectory) => new Promise(resolve => {
    const child = spawn(command, args, { cwd: executionDirectory });
    child.stdout.on('data', d => console.log(d.toString()));
    child.stderr.on('data', d => console.log(d.toString()));
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
const initializeFlyApplication = async () => {
    const spinner = createSpinner('Initializing deployment configuration...').start();
    await executeCommand('fly', ['launch', '--name', projectName, '--region', region], projectDirectory);
    spinner.success();
};
const deployFlyApplication = async () => {
    const spinner = createSpinner('Deploying application...').start();
    await executeCommand('fly', ['deploy'], projectDirectory);
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
await askForFlyDeployment();
if (deploy) {
    await askForFlyDeploymentRegion();
}
projectDirectory = `${process.cwd()}/${projectName}`;
if (projectName && !fs.existsSync(projectName)) {
    fs.mkdirSync(projectDirectory);
    await installNodeDependencies();
    addConfigurationFiles();
    if (deploy) {
        await initializeFlyApplication();
        await deployFlyApplication();
    }
    await initializeGit(projectDirectory);
}
