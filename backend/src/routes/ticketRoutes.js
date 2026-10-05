import express from 'express';
import { defaultTicketController } from '../controllers/ticketController.js';

export function createTicketRoutes(controller = defaultTicketController) {
  const router = express.Router();

  // Summary counts must precede /:id to prevent route clash
  router.get('/summary', controller.getSummaryCounts);

  // Tickets CRUD
  router.get('/', controller.listTickets);
  router.post('/', controller.createTicket);
  router.get('/:id', controller.getTicketById);
  router.patch('/:id', controller.updateTicket);
  router.put('/:id', controller.updateTicket);

  return router;
}

export const ticketRoutes = createTicketRoutes();
