import { defaultTicketService } from '../services/ticketService.js';
import { validateCreateTicket, validateUpdateTicket } from '../validators/ticketValidator.js';

export function createTicketController(service = defaultTicketService) {
  return {
    async listTickets(req, res, next) {
      try {
        const { search, status, priority, sort, page, limit } = req.query;
        const result = service.listTickets({ search, status, priority, sort, page, limit });
        res.status(200).json({
          success: true,
          data: result.tickets,
          pagination: result.pagination
        });
      } catch (err) {
        next(err);
      }
    },

    async getTicketById(req, res, next) {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_ID',
              message: 'Ticket ID must be a positive integer.'
            }
          });
        }

        const ticket = service.getTicketById(id);
        if (!ticket) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'TICKET_NOT_FOUND',
              message: `Ticket with ID ${id} was not found.`
            }
          });
        }

        res.status(200).json({
          success: true,
          data: ticket
        });
      } catch (err) {
        next(err);
      }
    },

    async createTicket(req, res, next) {
      try {
        const validation = validateCreateTicket(req.body);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed for ticket creation.',
              details: validation.errors
            }
          });
        }

        const ticket = service.createTicket(req.body);
        res.status(201).json({
          success: true,
          message: 'Ticket created successfully.',
          data: ticket
        });
      } catch (err) {
        next(err);
      }
    },

    async updateTicket(req, res, next) {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_ID',
              message: 'Ticket ID must be a positive integer.'
            }
          });
        }

        const validation = validateUpdateTicket(req.body);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed for ticket update.',
              details: validation.errors
            }
          });
        }

        const updated = service.updateTicket(id, req.body);
        if (!updated) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'TICKET_NOT_FOUND',
              message: `Ticket with ID ${id} was not found.`
            }
          });
        }

        res.status(200).json({
          success: true,
          message: 'Ticket updated successfully.',
          data: updated
        });
      } catch (err) {
        next(err);
      }
    },

    async getSummaryCounts(req, res, next) {
      try {
        const counts = service.getSummaryCounts();
        res.status(200).json({
          success: true,
          data: counts
        });
      } catch (err) {
        next(err);
      }
    }
  };
}

export const defaultTicketController = createTicketController();
