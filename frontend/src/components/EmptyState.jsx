import React from 'react';
import { Inbox, SearchX, Plus, RotateCcw } from 'lucide-react';

export function EmptyState({ isFiltered, onResetFilters, onOpenCreateModal }) {
  if (isFiltered) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: '#f87171'
        }}>
          <SearchX size={26} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
          No matching tickets found
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem' }}>
          We couldn't find any tickets matching your current search query or filter criteria. Try adjusting or clearing your filters.
        </p>
        <button
          onClick={onResetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-highlight)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <RotateCcw size={15} />
          <span>Reset all filters</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px dashed var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '4rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.15rem',
        color: 'var(--color-primary)'
      }}>
        <Inbox size={28} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
        No support tickets yet
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '1.5rem' }}>
        Your support inbox is clear! Start tracking incoming customer inquiries by creating your first ticket.
      </p>
      <button
        onClick={onOpenCreateModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)',
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Create first ticket</span>
      </button>
    </div>
  );
}
