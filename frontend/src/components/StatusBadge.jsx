import React from 'react';

export function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Open':
        return {
          color: 'var(--status-open-text)',
          backgroundColor: 'var(--status-open-bg)',
          borderColor: 'var(--status-open-border)'
        };
      case 'In Progress':
        return {
          color: 'var(--status-progress-text)',
          backgroundColor: 'var(--status-progress-bg)',
          borderColor: 'var(--status-progress-border)'
        };
      case 'Resolved':
        return {
          color: 'var(--status-resolved-text)',
          backgroundColor: 'var(--status-resolved-bg)',
          borderColor: 'var(--status-resolved-border)'
        };
      default:
        return {
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-subtle)'
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className="badge"
      style={{
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        border: `1px solid ${styles.borderColor}`
      }}
    >
      <span
        className="badge-dot"
        style={{ backgroundColor: styles.color }}
      />
      {status || 'Unknown'}
    </span>
  );
}
