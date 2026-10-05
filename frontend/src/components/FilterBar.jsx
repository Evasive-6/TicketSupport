import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onResetFilters,
  totalResults
}) {
  const hasActiveFilters = Boolean(
    (search && search.trim().length > 0) ||
    (status && status !== 'all') ||
    (priority && priority !== 'all') ||
    (sort && sort !== 'newest')
  );

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.15rem 1.25rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 260px',
          minWidth: '220px'
        }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            id="ticket-search-input"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or customer email..."
            style={{
              width: '100%',
              padding: '0.65rem 2.2rem 0.65rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.875rem'
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              title="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ flex: '0 1 150px', minWidth: '130px' }}>
          <select
            id="ticket-status-filter"
            value={status || 'all'}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: status && status !== 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: status && status !== 'all' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div style={{ flex: '0 1 150px', minWidth: '130px' }}>
          <select
            id="ticket-priority-filter"
            value={priority || 'all'}
            onChange={(e) => onPriorityChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: priority && priority !== 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: priority && priority !== 'all' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div style={{ flex: '0 1 160px', minWidth: '140px' }}>
          <select
            id="ticket-sort-select"
            value={sort || 'newest'}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
          </select>
        </div>

        {/* Clear Active Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            id="btn-reset-filters"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.825rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
