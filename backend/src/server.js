import { app } from './app.js';
import { config } from './config.js';
import { migrate } from './db/migrate.js';
import { getDatabase } from './db/index.js';

// Ensure tables exist before handling incoming traffic
try {
  const db = getDatabase();
  migrate(db);
  console.log(`[Database] Initialized and connected at: ${config.databasePath}`);
} catch (err) {
  console.error('[Database] Failed to initialize database:', err);
  process.exit(1);
}

const server = app.listen(config.port, () => {
  console.log(`[Server] Support Ticket API running at http://localhost:${config.port}`);
  console.log(`[Server] Environment: ${config.nodeEnv}`);
});

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Process terminated.');
  });
});
