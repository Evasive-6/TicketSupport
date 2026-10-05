import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem',
      color: '#fca5a5'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={18} color="#f87171" />
        </div>
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.15rem' }}>
            Failed to load support tickets
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#fca5a5' }}>
            {error.message || 'There was a problem communicating with the backend API. Please make sure the server is running.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ffffff',
            fontSize: '0.825rem',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
