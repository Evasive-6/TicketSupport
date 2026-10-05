import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.75rem',
      right: '1.75rem',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.15rem',
      borderRadius: 'var(--radius-md)',
      background: isError ? '#7f1d1d' : '#064e3b',
      border: `1px solid ${isError ? '#ef4444' : '#10b981'}`,
      boxShadow: 'var(--shadow-lg)',
      color: '#ffffff',
      fontSize: '0.875rem',
      fontWeight: 500,
      maxWidth: '380px',
      animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {isError ? (
        <AlertCircle size={18} color="#fca5a5" style={{ flexShrink: 0 }} />
      ) : (
        <CheckCircle2 size={18} color="#6ee7b7" style={{ flexShrink: 0 }} />
      )}

      <div style={{ flex: 1 }}>{toast.message}</div>

      <button
        onClick={onClose}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
