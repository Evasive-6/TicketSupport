import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from './index.js';
import { migrate } from './migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function seedDatabase(customDb, options = { reset: true }) {
  const db = customDb || getDatabase();
  migrate(db);

  if (options.reset) {
    db.prepare('DELETE FROM tickets').run();
    // Reset autoincrement sequence if sqlite_sequence exists
    try {
      db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tickets'").run();
    } catch {
      // ignore if sqlite_sequence not found
    }
  }

  const rawSeed = fs.readFileSync(path.resolve(__dirname, 'seedData.json'), 'utf8');
  const tickets = JSON.parse(rawSeed);

  const insertStmt = db.prepare(`
    INSERT INTO tickets (title, description, customer_email, priority, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertStmt.run(
        item.title,
        item.description,
        item.customer_email,
        item.priority,
        item.status || 'Open',
        item.created_at || new Date().toISOString(),
        item.updated_at || new Date().toISOString()
      );
    }
  });

  insertMany(tickets);

  const countRow = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
  return { seededCount: tickets.length, totalTickets: countRow.count };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  console.log('Seeding support tickets database...');
  const result = seedDatabase();
  console.log(`Successfully seeded ${result.seededCount} tickets! (Total in DB: ${result.totalTickets})`);
}
