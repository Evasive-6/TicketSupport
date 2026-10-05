import React from 'react';
import { Layers, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export function StatsOverview({ summary, activeStatusFilter, onStatusFilterSelect, isLoading }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Tickets',
      count: summary?.total ?? 0,
      filterValue: 'all',
      icon: <Layers size={20} color="#a5b4fc" />,
      color: '#a5b4fc',
      bgGlow: 'rgba(99, 102, 241, 0.12)',
      borderAccent: 'rgba(99, 102, 241, 0.3)'
    },
    {
      id: 'open',
      label: 'Open',
      count: summary?.open ?? 0,
      filterValue: 'Open',
      icon: <AlertCircle size={20} color="var(--status-open-text)" />,
      color: 'var(--status-open-text)',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      borderAccent: 'rgba(56, 189, 248, 0.3)'
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      count: summary?.inProgress ?? 0,
      filterValue: 'In Progress',
      icon: <Clock size={20} color="var(--status-progress-text)" />,
      color: 'var(--status-progress-text)',
      bgGlow: 'rgba(251, 191, 248, 0.12)',
      borderAccent: 'rgba(251, 191, 36, 0.3)'
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: summary?.resolved ?? 0,
      filterValue: 'Resolved',
      icon: <CheckCircle2 size={20} color="var(--status-resolved-text)" />,
      color: 'var(--status-resolved-text)',
      bgGlow: 'rgba(52, 211, 153, 0.12)',
      borderAccent: 'rgba(52, 211, 153, 0.3)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {cards.map((card) => {
        const isSelected =
          (card.filterValue === 'all' && (!activeStatusFilter || activeStatusFilter === 'all')) ||
          activeStatusFilter === card.filterValue;

        return (
          <button
            key={card.id}
            onClick={() => onStatusFilterSelect(card.filterValue === activeStatusFilter ? 'all' : card.filterValue)}
            title={`Click to filter by ${card.label}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: isSelected
                ? `2px solid ${card.color}`
                : '1px solid var(--border-subtle)',
              boxShadow: isSelected
                ? `0 6px 20px ${card.bgGlow}`
                : 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'left',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <div>
              <span style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.35rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {card.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                {isLoading ? (
                  <div className="skeleton" style={{ width: '45px', height: '32px' }} />
                ) : (
                  <span style={{
                    fontSize: '1.95rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#ffffff'
                  }}>
                    {card.count}
                  </span>
                )}
                {card.filterValue !== 'all' && summary?.total > 0 && !isLoading && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({Math.round((card.count / summary.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: card.bgGlow,
              border: `1px solid ${card.borderAccent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {card.icon}
            </div>
          </button>
        );
      })}
    </div>
  );
}
