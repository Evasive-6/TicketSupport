import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { getDatabase } from '../src/db/index.js';
import { migrate } from '../src/db/migrate.js';
import { TicketService } from '../src/services/ticketService.js';
import { createTicketController } from '../src/controllers/ticketController.js';
import { createTicketRoutes } from '../src/routes/ticketRoutes.js';

describe('Support Ticket API Test Suite', () => {
  let app;
  let db;
  let ticketService;

  before(() => {
    // Set up an isolated in-memory SQLite database for testing
    db = getDatabase(':memory:');
    migrate(db);
    ticketService = new TicketService(db);
    const controller = createTicketController(ticketService);
    const routes = createTicketRoutes(controller);
    app = createApp(routes);
  });

  beforeEach(() => {
    // Clear tickets table and reset autoincrement before each test
    db.prepare('DELETE FROM tickets').run();
    try {
      db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tickets'").run();
    } catch {}
  });

  // ==========================================
  // 1. VALIDATION TESTS
  // ==========================================
  describe('Ticket Creation Validation', () => {
    it('should reject creation when title is missing or empty', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: '   ',
          description: 'Valid description',
          customer_email: 'user@example.com',
          priority: 'High'
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.details.title);
      assert.match(res.body.error.details.title, /Title is required/i);
    });

    it('should reject creation when title exceeds 120 characters', async () => {
      const longTitle = 'A'.repeat(121);
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: longTitle,
          description: 'Valid description',
          customer_email: 'user@example.com',
          priority: 'Medium'
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.details.title);
      assert.match(res.body.error.details.title, /must not exceed 120 characters/i);
    });

    it('should reject creation when customer email format is invalid', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Checkout button broken',
          description: 'Clicking submit triggers 500 error',
          customer_email: 'invalid-email-address',
          priority: 'High'
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.details.customer_email);
      assert.match(res.body.error.details.customer_email, /valid email/i);
    });

    it('should reject creation when priority is not Low, Medium, or High', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description',
          customer_email: 'valid@example.com',
          priority: 'Urgent' // Invalid priority
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.details.priority);
      assert.match(res.body.error.details.priority, /must be one of: Low, Medium, High/i);
    });

    it('should successfully create a valid ticket and default status to Open', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Database connection latency spike',
          description: 'Queries taking over 1500ms on secondary replica',
          customer_email: 'dba@company.com',
          priority: 'High'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, 'Database connection latency spike');
      assert.equal(res.body.data.status, 'Open'); // Defaulted to Open
      assert.equal(res.body.data.priority, 'High');
      assert.ok(res.body.data.id > 0);
      assert.ok(res.body.data.created_at);
      assert.ok(res.body.data.updated_at);
    });
  });

  // ==========================================
  // 2. QUERYING, SEARCHING, FILTERING & PAGINATION TESTS
  // ==========================================
  describe('Ticket Querying, Filtering, and Pagination', () => {
    beforeEach(() => {
      // Seed 15 sample tickets for querying tests
      const insert = db.prepare(`
        INSERT INTO tickets (title, description, customer_email, priority, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 1; i <= 15; i++) {
        const priority = i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low';
        const status = i <= 6 ? 'Open' : i <= 11 ? 'In Progress' : 'Resolved';
        const date = new Date(Date.now() - (15 - i) * 3600000).toISOString();
        insert.run(
          `Ticket #${i}: Issue with feature ${i}`,
          `Detailed description for issue ${i}`,
          i === 5 ? 'special.customer@target.com' : `user${i}@example.com`,
          priority,
          status,
          date,
          date
        );
      }
    });

    it('should paginate tickets with 10 items per page by default', async () => {
      const res = await request(app).get('/api/tickets?page=1');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.length, 10);
      assert.equal(res.body.pagination.total, 15);
      assert.equal(res.body.pagination.totalPages, 2);
      assert.equal(res.body.pagination.page, 1);
      assert.equal(res.body.pagination.hasNext, true);
      assert.equal(res.body.pagination.hasPrev, false);

      // Page 2 should have the remaining 5 items
      const res2 = await request(app).get('/api/tickets?page=2');
      assert.equal(res2.status, 200);
      assert.equal(res2.body.data.length, 5);
      assert.equal(res2.body.pagination.hasNext, false);
      assert.equal(res2.body.pagination.hasPrev, true);
    });

    it('should search tickets by title', async () => {
      const res = await request(app).get('/api/tickets?search=feature 5');

      assert.equal(res.status, 200);
      assert.equal(res.body.data.length, 1);
      assert.equal(res.body.data[0].title, 'Ticket #5: Issue with feature 5');
    });

    it('should search tickets by customer email', async () => {
      const res = await request(app).get('/api/tickets?search=special.customer@target.com');

      assert.equal(res.status, 200);
      assert.equal(res.body.data.length, 1);
      assert.equal(res.body.data[0].customer_email, 'special.customer@target.com');
    });

    it('should filter tickets by status and priority simultaneously', async () => {
      const res = await request(app).get('/api/tickets?status=Open&priority=High');

      assert.equal(res.status, 200);
      assert.ok(res.body.data.length > 0);
      for (const t of res.body.data) {
        assert.equal(t.status, 'Open');
        assert.equal(t.priority, 'High');
      }
    });

    it('should sort tickets by creation date newest and oldest', async () => {
      const newestRes = await request(app).get('/api/tickets?sort=newest&limit=2');
      assert.equal(newestRes.status, 200);
      assert.equal(newestRes.body.data[0].title, 'Ticket #15: Issue with feature 15');

      const oldestRes = await request(app).get('/api/tickets?sort=oldest&limit=2');
      assert.equal(oldestRes.status, 200);
      assert.equal(oldestRes.body.data[0].title, 'Ticket #1: Issue with feature 1');
    });
  });

  // ==========================================
  // 3. TICKET UPDATING & PERSISTENCE TESTS
  // ==========================================
  describe('Ticket Updates and Persistence', () => {
    let createdTicketId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'SSL certificate expiring soon',
          description: 'Let\'s Encrypt certificate will expire in 7 days',
          customer_email: 'security@cloudcorp.com',
          priority: 'Medium'
        });
      createdTicketId = res.body.data.id;
    });

    it('should update status and persist the change', async () => {
      const updateRes = await request(app)
        .patch(`/api/tickets/${createdTicketId}`)
        .send({ status: 'In Progress' });

      assert.equal(updateRes.status, 200);
      assert.equal(updateRes.body.data.status, 'In Progress');

      // Verify persistence by fetching ticket by ID
      const fetchRes = await request(app).get(`/api/tickets/${createdTicketId}`);
      assert.equal(fetchRes.status, 200);
      assert.equal(fetchRes.body.data.status, 'In Progress');
    });

    it('should update priority and persist the change', async () => {
      const updateRes = await request(app)
        .patch(`/api/tickets/${createdTicketId}`)
        .send({ priority: 'High' });

      assert.equal(updateRes.status, 200);
      assert.equal(updateRes.body.data.priority, 'High');

      const fetchRes = await request(app).get(`/api/tickets/${createdTicketId}`);
      assert.equal(fetchRes.status, 200);
      assert.equal(fetchRes.body.data.priority, 'High');
    });

    it('should reject update with invalid status or priority', async () => {
      const invalidStatusRes = await request(app)
        .patch(`/api/tickets/${createdTicketId}`)
        .send({ status: 'InvalidStatus' });

      assert.equal(invalidStatusRes.status, 400);
      assert.ok(invalidStatusRes.body.error.details.status);

      const invalidPriorityRes = await request(app)
        .patch(`/api/tickets/${createdTicketId}`)
        .send({ priority: 'Critical' });

      assert.equal(invalidPriorityRes.status, 400);
      assert.ok(invalidPriorityRes.body.error.details.priority);
    });

    it('should return 404 when updating non-existent ticket', async () => {
      const res = await request(app)
        .patch('/api/tickets/999999')
        .send({ status: 'Resolved' });

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'TICKET_NOT_FOUND');
    });
  });

  // ==========================================
  // 4. SUMMARY COUNTS TEST
  // ==========================================
  describe('Summary Counts Endpoint', () => {
    it('should reflect entire dataset regardless of active filters', async () => {
      // Seed 2 Open, 3 In Progress, 4 Resolved = 9 tickets
      const insert = db.prepare(`
        INSERT INTO tickets (title, description, customer_email, priority, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();

      insert.run('T1', 'Desc', 'a@a.com', 'Low', 'Open', now, now);
      insert.run('T2', 'Desc', 'a@a.com', 'High', 'Open', now, now);
      insert.run('T3', 'Desc', 'b@b.com', 'Medium', 'In Progress', now, now);
      insert.run('T4', 'Desc', 'b@b.com', 'High', 'In Progress', now, now);
      insert.run('T5', 'Desc', 'b@b.com', 'Low', 'In Progress', now, now);
      insert.run('T6', 'Desc', 'c@c.com', 'Low', 'Resolved', now, now);
      insert.run('T7', 'Desc', 'c@c.com', 'Medium', 'Resolved', now, now);
      insert.run('T8', 'Desc', 'c@c.com', 'High', 'Resolved', now, now);
      insert.run('T9', 'Desc', 'c@c.com', 'Low', 'Resolved', now, now);

      const res = await request(app).get('/api/tickets/summary');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.total, 9);
      assert.equal(res.body.data.open, 2);
      assert.equal(res.body.data.inProgress, 3);
      assert.equal(res.body.data.resolved, 4);
    });
  });
});
