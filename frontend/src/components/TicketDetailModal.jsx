import React, { useState, useEffect } from 'react';
import { X, Mail, Calendar, Clock, Copy, Check, Save, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, timeAgo } from '../utils/formatters';

export function TicketDetailModal({ ticket, onClose, onUpdateTicket, isUpdating }) {
  const [status, setStatus] = useState(ticket?.status || 'Open');
  const [priority, setPriority] = useState(ticket?.priority || 'Medium');
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setLocalError(null);
    }
  }, [ticket]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const hasChanges = status !== ticket.status || priority !== ticket.priority;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ticket.customer_email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    try {
      setLocalError(null);
      await onUpdateTicket(ticket.id, { status, priority });
    } catch (err) {
      setLocalError(err.message || 'Failed to update ticket. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: 700
            }}>
              Ticket #{ticket.id}
            </span>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>

          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {localError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              <span>{localError}</span>
            </div>
          )}

          {/* Title */}
          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.35,
            marginBottom: '1rem'
          }}>
            {ticket.title}
          </h2>

          {/* Customer Metadata Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-secondary)' }}>Customer:</span>
              <a
                href={`mailto:${ticket.customer_email}`}
                style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
              >
                {ticket.customer_email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                style={{
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px',
                  marginLeft: '2px'
                }}
              >
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Problem Description
            </label>
            <div style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap'
            }}>
              {ticket.description}
            </div>
          </div>

          {/* Interactive Status & Priority Editor */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Update Ticket Triage</span>
              {hasChanges && (
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                  Unsaved changes
                </span>
              )}
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Status Selector */}
              <div>
                <label
                  htmlFor="edit-status"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem'
                  }}
                >
                  Status
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.875rem',
                    color: '#ffffff'
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label
                  htmlFor="edit-priority"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem'
                  }}
                >
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.875rem',
                    color: '#ffffff'
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || isUpdating}
                id="btn-save-ticket-changes"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: hasChanges
                    ? 'linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)'
                    : 'var(--bg-surface)',
                  border: hasChanges ? 'none' : '1px solid var(--border-subtle)',
                  color: hasChanges ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: hasChanges && !isUpdating ? 'pointer' : 'not-allowed',
                  boxShadow: hasChanges ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
                }}
              >
                <Save size={15} />
                <span>{isUpdating ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Audit Timestamps */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={13} />
              <span>Created: {formatDate(ticket.created_at)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={13} />
              <span>Last updated: {formatDate(ticket.updated_at)} ({timeAgo(ticket.updated_at)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
