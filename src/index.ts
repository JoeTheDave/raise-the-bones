#!/usr/bin/env node

import fs from 'fs'
import { exec, spawn } from 'child_process'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import * as fileContent from './fileContent.js'

console.log(gradient('#666', '#FFF', '#666')('RAISE THE BONES!'))

const askProjectName = async () => {
  const answers = await inquirer.prompt({
    name: 'projectName',
    type: 'input',
    message: 'Project Name?',
  })
  return answers.projectName
}

const executeCommand = (command: string, args: string[], executionDirectory: string) =>
  new Promise<void>(resolve => {
    const child = spawn(command, args, { cwd: executionDirectory })
    child.on('close', () => {
      resolve()
    })
  })

const installNodeDependencies = async (directory: string) => {
  const spinner = createSpinner('Installing dependencies...').start()
  await executeCommand('npm', ['init', '-y'], directory)
  await executeCommand('npm', ['i', 'express', 'ts-node', 'typescript'], directory)
  await executeCommand(
    'npm',
    [
      'i',
      '-D',
      '@types/node',
      '@types/express',
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-airbnb-typescript',
    ],
    directory,
  )
  await executeCommand('npx', ['--yes', 'install-peerdeps', '--dev', 'eslint-config-airbnb'], directory)
  spinner.success()
}

const addConfigurationFiles = (directory: string, projectName: string) => {
  const spinner = createSpinner('Adding configuration files ...').start()
  exec('node -v', (err, nodeVersion) => {
    if (!err) {
      fs.writeFileSync(`${directory}/.nvmrc`, nodeVersion.replace('v', ''))
    }
  })
  fs.writeFileSync(`${directory}/.gitignore`, fileContent.gitIgnore())
  fs.writeFileSync(`${directory}/.prettierrc`, fileContent.prettierrc())
  fs.writeFileSync(`${directory}/.eslintrc.json`, fileContent.eslint())
  fs.writeFileSync(`${directory}/tsconfig.json`, fileContent.tsConfig())
  fs.mkdirSync(`${directory}/src`)
  fs.writeFileSync(`${directory}/src/server.ts`, fileContent.serverTs())
  fs.writeFileSync(`${directory}/src/index.html`, fileContent.indexHtml(projectName))

  const packageJson = JSON.parse(fs.readFileSync(`${directory}/package.json`, { encoding: 'utf8', flag: 'r' }))
  packageJson.scripts = {
    start: 'ts-node --esm src/server.ts',
  }
  packageJson.type = 'module'
  fs.writeFileSync(`${directory}/package.json`, JSON.stringify(packageJson, null, 2))

  spinner.success()
}

const initializeGit = async (directory: string) => {
  const spinner = createSpinner('Initializing git...').start()
  await executeCommand('git', ['init'], directory)
  await executeCommand('git', ['add', '-A'], directory)
  await executeCommand('git', ['commit', '-m', 'initializing project with raise-the-bones'], directory)
  spinner.success()
}

const projectName = await askProjectName()
const projectDirectory = `${process.cwd()}/${projectName}`
if (projectName && !fs.existsSync(projectName)) {
  fs.mkdirSync(projectDirectory)
  await installNodeDependencies(projectDirectory)
  addConfigurationFiles(projectDirectory, projectName)
  await initializeGit(projectDirectory)
}
