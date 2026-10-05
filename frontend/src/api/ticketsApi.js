const API_BASE = '/api/tickets';

async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(
      (data && data.error && data.error.message) ||
      `Request failed with status code ${res.status}`
    );
    error.status = res.status;
    error.code = data?.error?.code || 'API_ERROR';
    error.details = data?.error?.details || null;
    throw error;
  }

  return data;
}

export async function fetchTickets({
  search = '',
  status = '',
  priority = '',
  sort = 'newest',
  page = 1,
  limit = 10
} = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  if (priority && priority !== 'all') params.append('priority', priority);
  if (sort) params.append('sort', sort);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  return handleResponse(res);
}

export async function fetchSummaryCounts() {
  const res = await fetch(`${API_BASE}/summary`);
  return handleResponse(res);
}

export async function fetchTicketById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  return handleResponse(res);
}

export async function createTicket(ticketData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  return handleResponse(res);
}

export async function updateTicket(id, ticketData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  return handleResponse(res);
}
