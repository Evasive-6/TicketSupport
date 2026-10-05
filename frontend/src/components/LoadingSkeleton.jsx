import React from 'react';

export function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ flex: '0 0 50px' }}>
            <div className="skeleton" style={{ width: '40px', height: '20px' }} />
          </div>

          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="skeleton" style={{ width: `${60 + (i % 4) * 10}%`, height: '20px' }} />
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
          </div>

          <div style={{ flex: '0 0 160px' }} className="hide-on-mobile">
            <div className="skeleton" style={{ width: '120px', height: '16px' }} />
          </div>

          <div style={{ flex: '0 0 90px' }} className="hide-on-mobile">
            <div className="skeleton" style={{ width: '75px', height: '24px', borderRadius: 'var(--radius-full)' }} />
          </div>

          <div style={{ flex: '0 0 100px' }}>
            <div className="skeleton" style={{ width: '85px', height: '24px', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
