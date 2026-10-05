import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { ticketRoutes } from './routes/ticketRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDistPath = path.resolve(__dirname, '../../frontend/dist');

export function createApp(customTicketRoutes = ticketRoutes) {
  const app = express();

  // Configure CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // JSON Body Parser
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount Ticket Routes
  app.use('/api/tickets', customTicketRoutes);

  // Serve static frontend assets if build directory exists
  const clientDistPath = process.env.CLIENT_DIST_PATH || defaultDistPath;
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Client-side SPA routing fallback for non-API routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // 404 handler for unmatched API requests
  app.use(notFoundHandler);

  // Central error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();

