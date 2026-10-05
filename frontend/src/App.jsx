import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { TicketTable } from './components/TicketTable';
import { TicketCardList } from './components/TicketCardList';
import { Pagination } from './components/Pagination';
import { TicketDetailModal } from './components/TicketDetailModal';
import { CreateTicketModal } from './components/CreateTicketModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorBanner } from './components/ErrorBanner';
import { Toast } from './components/Toast';
import {
  fetchTickets,
  fetchSummaryCounts,
  fetchTicketById,
  createTicket,
  updateTicket
} from './api/ticketsApi';

export function App() {
  // Query & Filter State initialized from URL query params for persistence across page refresh
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(urlParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(urlParams.get('search') || '');
  const [status, setStatus] = useState(urlParams.get('status') || 'all');
  const [priority, setPriority] = useState(urlParams.get('priority') || 'all');
  const [sort, setSort] = useState(urlParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(urlParams.get('page') || '1', 10));

  // Data State
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [summary, setSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState(null);

  // Debounce search input by 300ms to reduce unnecessary API roundtrips
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (value) => {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1); // Reset to page 1 on new search
    }, 280);
  };

  // Sync state to URL search parameters for refresh persistence
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (status && status !== 'all') params.set('status', status);
    if (priority && priority !== 'all') params.set('priority', priority);
    if (sort && sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    if (selectedTicket) params.set('ticketId', selectedTicket.id.toString());

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedSearch, status, priority, sort, page, selectedTicket]);

  // Load summary counts (reflects entire dataset regardless of active filters)
  const loadSummary = useCallback(async () => {
    try {
      const res = await fetchSummaryCounts();
      if (res && res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load summary counts:', err);
    }
  }, []);

  // Load paginated & filtered tickets
  const loadTickets = useCallback(async (isRefreshAction = false) => {
    if (isRefreshAction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await fetchTickets({
        search: debouncedSearch,
        status,
        priority,
        sort,
        page,
        limit: 10
      });

      if (res && res.success) {
        setTickets(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, status, priority, sort, page]);

  // Initial load & when filters change
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Restore selected ticket from URL on initial load if present
  useEffect(() => {
    const ticketId = urlParams.get('ticketId');
    if (ticketId && !selectedTicket) {
      fetchTicketById(ticketId)
        .then((res) => {
          if (res && res.data) {
            setSelectedTicket(res.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Filter handlers
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('all');
    setPriority('all');
    setSort('newest');
    setPage(1);
  };

  // Ticket creation handler
  const handleCreateTicket = async (ticketData) => {
    setIsCreating(true);
    try {
      const res = await createTicket(ticketData);
      setToast({
        type: 'success',
        message: `Ticket #${res.data.id} "${res.data.title.slice(0, 30)}..." created!`
      });
      // Refresh list and summary counts
      await Promise.all([loadTickets(true), loadSummary()]);
      return res.data;
    } finally {
      setIsCreating(false);
    }
  };

  // Ticket update handler
  const handleUpdateTicket = async (id, fields) => {
    setIsUpdating(true);
    try {
      const res = await updateTicket(id, fields);
      setSelectedTicket(res.data);
      // Update in local ticket list immediately
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
      setToast({
        type: 'success',
        message: `Ticket #${id} updated: Status is now "${res.data.status}", Priority "${res.data.priority}".`
      });
      // Refresh summary counts to reflect updated status distribution
      loadSummary();
      return res.data;
    } finally {
      setIsUpdating(false);
    }
  };

  const isFiltered = Boolean(
    debouncedSearch || (status && status !== 'all') || (priority && priority !== 'all')
  );

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => {
          loadTickets(true);
          loadSummary();
        }}
        isRefreshing={isRefreshing}
      />

      {/* Global Summary Statistics Cards (Total, Open, In Progress, Resolved) */}
      <StatsOverview
        summary={summary}
        activeStatusFilter={status}
        onStatusFilterSelect={handleStatusChange}
        isLoading={isLoading && !isRefreshing && tickets.length === 0}
      />

      {/* Search, Filter & Sort Controls */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
        sort={sort}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        totalResults={pagination.total}
      />

      {/* Error state */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={() => {
            loadTickets();
            loadSummary();
          }}
        />
      )}

      {/* Loading state */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : tickets.length === 0 ? (
        /* Empty state */
        <EmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      ) : (
        /* Ticket List Views */
        <div>
          {/* Desktop Table View */}
          <div className="ticket-table-wrapper">
            <TicketTable
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
            />
          </div>

          {/* Mobile Card View */}
          <div className="ticket-cards-wrapper">
            <TicketCardList
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
            />
          </div>

          {/* Pagination Controls */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Ticket Detail & Triage Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
          isUpdating={isUpdating}
        />
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTicket={handleCreateTicket}
        isCreating={isCreating}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Responsive View Styles */}
      <style>{`
        .ticket-cards-wrapper {
          display: none;
        }
        .ticket-table-wrapper {
          display: block;
        }
        @media (max-width: 768px) {
          .ticket-table-wrapper {
            display: none;
          }
          .ticket-cards-wrapper {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
