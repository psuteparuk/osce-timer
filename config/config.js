import * as path from 'path';

export const HOST = process.env.HOST || 'localhost';
export const PORT = process.env.PORT || 3001;

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(__dirname, '../src');

export function root(...args) {
  return path.join(ROOT, args.join('/'));
}

export function src(...args) {
  return path.join(SRC_DIR, args.join('/'));
}
