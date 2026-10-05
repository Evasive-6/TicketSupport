import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function migrate(customDb) {
  const db = customDb || getDatabase();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  return db;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  console.log('Running database migrations...');
  migrate();
  console.log('Database migrations completed successfully.');
}
