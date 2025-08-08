import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

export async function runSetupTasks(targetDir: string, projectName: string): Promise<void> {
  process.chdir(targetDir);

  try {
    // Initialize git repository
    console.log(chalk.gray('  • Initializing git repository...'));
    await runCommand('git', ['init']);

    // Install dependencies
    console.log(chalk.gray('  • Installing dependencies...'));
    await runCommand('npm', ['install']);

    // Generate Prisma client
    console.log(chalk.gray('  • Generating Prisma client...'));
    await runCommand('npm', ['run', 'db:generate']);

    // Create initial git commit
    console.log(chalk.gray('  • Creating initial commit...'));
    await runCommand('git', ['add', '.']);
    await runCommand('git', ['commit', '-m', `"Initial commit for ${projectName}"`]);

    console.log(chalk.green('  ✓ Setup completed successfully'));

  } catch (error) {
    console.error(chalk.yellow('  ⚠ Some setup tasks failed, but the project was created successfully'));
    console.error(chalk.gray(`    Error: ${error instanceof Error ? error.message : String(error)}`));
  }
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true 
    });

    let stderr = '';

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}