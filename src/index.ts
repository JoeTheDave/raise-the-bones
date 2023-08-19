#!/usr/bin/env node

import fs from 'fs'
import { spawn } from 'child_process'
import gradient from 'gradient-string'
import inquirer from 'inquirer'

console.log(gradient('#666', '#FFF', '#666')('RAISE THE BONES!'))

let projectName = ''
const askProjectName = async () => {
  const answers = await inquirer.prompt({
    name: 'projectName',
    type: 'input',
    message: 'Project Name?',
  })
  projectName = answers.projectName
}

askProjectName().then(() => {
  if (projectName && !fs.existsSync(projectName)) {
    fs.mkdirSync(projectName)
    const proc = spawn('npm init -y', { cwd: `${process.cwd()}/${projectName}` })
    proc.stdout.on('data', data => console.log(data))
    proc.stderr.on('data', data => console.log(data))
    proc.on('close', () => console.log('Ending command'))
  }
})
