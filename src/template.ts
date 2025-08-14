import fs from 'fs-extra';
import path from 'path';
import { getTemplatePath, toPascalCase, toSnakeCase, toKebabCase, validateProjectName } from './utils.js';

interface TemplateVariables {
  PROJECT_NAME: string;
  PROJECT_NAME_SNAKE: string;
  PROJECT_NAME_PASCAL: string;
}

const FILES_TO_PROCESS = [
  'package.json',
  'docker-compose.yml',
  'fly.toml',
  'README.md',
  '.env',
  '.env.example',
  '.env.production.example',
  'scripts/ensure-database.sh',
  'client/src/App.tsx'
];

export async function createProject(projectName: string, targetDir: string): Promise<void> {
  // Validate project name
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const templatePath = getTemplatePath();
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template directory not found at: ${templatePath}`);
  }

  // Create target directory
  await fs.ensureDir(targetDir);

  // Copy all files from template
  await fs.copy(templatePath, targetDir);

  // Prepare template variables
  const variables: TemplateVariables = {
    PROJECT_NAME: toKebabCase(projectName),
    PROJECT_NAME_SNAKE: toSnakeCase(projectName),
    PROJECT_NAME_PASCAL: toPascalCase(projectName)
  };

  // Process template files
  for (const fileName of FILES_TO_PROCESS) {
    const filePath = path.join(targetDir, fileName);
    if (fs.existsSync(filePath)) {
      await processTemplateFile(filePath, variables);
    }
  }

  // Copy .env.example to .env for immediate development use
  const envExamplePath = path.join(targetDir, '.env.example');
  const envPath = path.join(targetDir, '.env');
  
  if (fs.existsSync(envExamplePath)) {
    await fs.copyFile(envExamplePath, envPath);
  }

  // Rename gitignore.template to .gitignore (npm excludes .gitignore files from packages)
  const gitignoreTemplatePath = path.join(targetDir, 'gitignore.template');
  const gitignorePath = path.join(targetDir, '.gitignore');
  
  if (fs.existsSync(gitignoreTemplatePath)) {
    await fs.rename(gitignoreTemplatePath, gitignorePath);
  }
}

async function processTemplateFile(filePath: string, variables: TemplateVariables): Promise<void> {
  let content = await fs.readFile(filePath, 'utf8');

  // Replace template variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });

  // Special case: replace the existing "raise-the-bones" name with the new project name
  content = content.replace(/raise-the-bones/g, variables.PROJECT_NAME);
  content = content.replace(/raise_the_bones/g, variables.PROJECT_NAME_SNAKE);

  await fs.writeFile(filePath, content);
}