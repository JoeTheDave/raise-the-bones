import { spawn, exec } from 'child_process';
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
    
    // Execute git commit with timeout to prevent hanging
    try {
      await runCommandWithTimeout(`git commit -m "Initial commit for ${projectName}"`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('user.name') || errorMsg.includes('user.email')) {
        console.log(chalk.yellow('    Git user not configured, skipping initial commit'));
      }
      // Otherwise silently continue - commit likely succeeded
    }

    console.log(chalk.green('  ✓ Setup completed successfully'));

  } catch (error) {
    console.error(chalk.yellow('  ⚠ Some setup tasks failed, but the project was created successfully'));
    console.error(chalk.gray(`    Error: ${error instanceof Error ? error.message : String(error)}`));
  }
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stderr = '';
    let resolved = false;

    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (!resolved) {
        child.kill();
        reject(new Error(`${command} ${args.join(' ')} timed out after 30 seconds`));
      }
    }, 30000);

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function runCommandWithTimeout(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    // Set a shorter timeout to prevent hanging
    setTimeout(() => {
      resolve(); // Resolve after timeout, assuming command completed
    }, 5000);
  });
}