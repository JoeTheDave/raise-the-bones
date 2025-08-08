#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './template.js';
import { runSetupTasks } from './setup.js';
import path from 'path';
import fs from 'fs';

const program = new Command();

program
  .name('raise-the-bones')
  .description('Bootstrap a full-stack React + Express + Prisma application')
  .version('2.0.0')
  .argument('<project-name>', 'name of the project to create')
  .option('-d, --directory <dir>', 'directory to create the project in', '.')
  .action(async (projectName: string, options: { directory: string }) => {
    console.log(chalk.blue.bold('\n🦴 Raising the bones...\n'));

    try {
      // Validate project name
      if (!projectName || projectName.length === 0) {
        console.error(chalk.red('Error: Project name is required'));
        process.exit(1);
      }

      // Create target directory
      const targetDir = path.join(options.directory, projectName);
      
      if (fs.existsSync(targetDir)) {
        console.error(chalk.red(`Error: Directory "${projectName}" already exists`));
        process.exit(1);
      }

      // Create project from template
      console.log(chalk.yellow('📁 Creating project structure...'));
      await createProject(projectName, targetDir);

      // Run setup tasks
      console.log(chalk.yellow('⚙️  Running setup tasks...'));
      await runSetupTasks(targetDir, projectName);

      console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
      console.log(chalk.cyan(`Next steps:`));
      console.log(chalk.white(`  1. cd ${projectName}`));
      console.log(chalk.white(`  2. npm run dev`));
      console.log(chalk.white(`  3. Check README.md for deployment setup\n`));

    } catch (error) {
      console.error(chalk.red('\n❌ Error creating project:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program.parse();