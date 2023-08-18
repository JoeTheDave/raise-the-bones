#!/usr/bin/env node
import fs from 'fs';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
console.log(gradient('#666', '#FFF', '#666')('RAISE THE BONES!'));
let projectName = '';
async function askProjectName() {
    const answers = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: 'Project Name?',
    });
    projectName = answers.projectName;
}
askProjectName().then(() => {
    if (projectName && !fs.existsSync(projectName)) {
        fs.mkdirSync(projectName);
    }
});
