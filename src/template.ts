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
  'README.md'
];

export async function createProject(projectName: string, targetDir: string): Promise<void> {
  // Validate project name
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const templatePath = getTemplatePath();
  
  if (!fs.existsSync(templatePath)) {
    throw new Error('Template directory not found');
  }

  // Create target directory
  await fs.ensureDir(targetDir);

  // Copy all files from template
  await fs.copy(templatePath, targetDir, {
    filter: (src) => {
      // Skip node_modules if it exists in template
      return !src.includes('node_modules');
    }
  });

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