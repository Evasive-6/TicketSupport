import { getDatabase } from '../db/index.js';

export class TicketService {
  constructor(db = null) {
    this._db = db;
  }

  get db() {
    return this._db || getDatabase();
  }

  /**
   * List tickets with search, filters, sorting, and pagination
   */
  listTickets({
    search = '',
    status = '',
    priority = '',
    sort = 'newest',
    page = 1,
    limit = 10
  } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereClauses = [];
    const params = [];

    // Search by title or customer email
    if (search && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      whereClauses.push('(LOWER(title) LIKE ? OR LOWER(customer_email) LIKE ?)');
      params.push(term, term);
    }

    // Filter by status
    if (status && status !== 'all' && ['Open', 'In Progress', 'Resolved'].includes(status)) {
      whereClauses.push('status = ?');
      params.push(status);
    }

    // Filter by priority
    if (priority && priority !== 'all' && ['Low', 'Medium', 'High'].includes(priority)) {
      whereClauses.push('priority = ?');
      params.push(priority);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Determine sorting order
    const isOldest = sort && sort.toLowerCase() === 'oldest';
    const orderSql = isOldest
      ? 'ORDER BY created_at ASC, id ASC'
      : 'ORDER BY created_at DESC, id DESC';

    // Count total matching items
    const countQuery = `SELECT COUNT(*) as count FROM tickets ${whereSql}`;
    const totalRow = this.db.prepare(countQuery).get(...params);
    const total = totalRow ? totalRow.count : 0;
    const totalPages = Math.ceil(total / limitNum) || 1;

    // Fetch paginated tickets
    const query = `
      SELECT id, title, description, customer_email, priority, status, created_at, updated_at
      FROM tickets
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;

    const tickets = this.db.prepare(query).all(...params, limitNum, offset);

    return {
      tickets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };
  }

  /**
   * Get single ticket by ID
   */
  getTicketById(id) {
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) return null;

    const stmt = this.db.prepare(`
      SELECT id, title, description, customer_email, priority, status, created_at, updated_at
      FROM tickets
      WHERE id = ?
    `);
    return stmt.get(ticketId) || null;
  }

  /**
   * Create a new ticket
   */
  createTicket({ title, description, customer_email, priority, status = 'Open' }) {
    const now = new Date().toISOString();
    const finalStatus = status || 'Open';

    const stmt = this.db.prepare(`
      INSERT INTO tickets (title, description, customer_email, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      title.trim(),
      description.trim(),
      customer_email.trim(),
      priority,
      finalStatus,
      now,
      now
    );

    return this.getTicketById(info.lastInsertRowid);
  }

  /**
   * Update an existing ticket (status and/or priority)
   */
  updateTicket(id, fields) {
    const existing = this.getTicketById(id);
    if (!existing) return null;

    const updates = [];
    const params = [];

    if (fields.status !== undefined) {
      updates.push('status = ?');
      params.push(fields.status);
    }

    if (fields.priority !== undefined) {
      updates.push('priority = ?');
      params.push(fields.priority);
    }

    if (fields.title !== undefined) {
      updates.push('title = ?');
      params.push(fields.title.trim());
    }

    if (fields.description !== undefined) {
      updates.push('description = ?');
      params.push(fields.description.trim());
    }

    const now = new Date().toISOString();
    updates.push('updated_at = ?');
    params.push(now);

    params.push(existing.id);

    const query = `
      UPDATE tickets
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    this.db.prepare(query).run(...params);
    return this.getTicketById(existing.id);
  }

  /**
   * Get summary counts for the entire dataset regardless of active filters
   */
  getSummaryCounts() {
    const stats = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END), 0) as open,
        COALESCE(SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END), 0) as inProgress,
        COALESCE(SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END), 0) as resolved,
        COALESCE(SUM(CASE WHEN priority = 'High' AND status != 'Resolved' THEN 1 ELSE 0 END), 0) as urgentOpen
      FROM tickets
    `).get();

    return {
      total: stats.total || 0,
      open: stats.open || 0,
      inProgress: stats.inProgress || 0,
      resolved: stats.resolved || 0,
      urgentOpen: stats.urgentOpen || 0
    };
  }
}

export const defaultTicketService = new TicketService();
