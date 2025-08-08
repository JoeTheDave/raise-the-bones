import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTemplatePath(): string {
  return path.join(__dirname, '..', 'template');
}

export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toSnakeCase(str: string): string {
  return str.replace(/-/g, '_');
}

export function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'Project name cannot be empty' };
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    return { valid: false, error: 'Project name can only contain lowercase letters, numbers, and hyphens' };
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Project name cannot start or end with a hyphen' };
  }

  if (name.includes('--')) {
    return { valid: false, error: 'Project name cannot contain consecutive hyphens' };
  }

  return { valid: true };
}