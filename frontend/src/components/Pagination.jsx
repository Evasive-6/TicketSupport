import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total === 0) return null;

  const { page, limit, total, totalPages, hasNext, hasPrev } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers array with intelligent ellipsis for many pages
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem 1rem 0 1rem',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: '1.25rem'
    }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Showing <strong style={{ color: '#ffffff' }}>{startItem}</strong> to{' '}
        <strong style={{ color: '#ffffff' }}>{endItem}</strong> of{' '}
        <strong style={{ color: '#ffffff' }}>{total}</strong> tickets
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          id="btn-prev-page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: hasPrev ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '0.825rem',
            fontWeight: 500,
            opacity: hasPrev ? 1 : 0.4,
            cursor: hasPrev ? 'pointer' : 'not-allowed'
          }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Page Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} style={{ padding: '0 0.4rem', color: 'var(--text-muted)' }}>
                  …
                </span>
              );
            }

            const isCurrent = p === page;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: isCurrent ? 'var(--color-primary)' : 'var(--bg-surface)',
                  border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          id="btn-next-page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: hasNext ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '0.825rem',
            fontWeight: 500,
            opacity: hasNext ? 1 : 0.4,
            cursor: hasNext ? 'pointer' : 'not-allowed'
          }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
