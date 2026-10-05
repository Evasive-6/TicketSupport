import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Plus, Send } from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const SAMPLE_TEMPLATES = [
  {
    title: 'Cannot export CSV report from analytics page',
    description: 'When clicking the export button on the billing metrics chart, a spinner appears for 30 seconds before timing out with an error code 504. Tried in both Chrome and Firefox.',
    customer_email: 'jordan.lee@acme-ventures.com',
    priority: 'High',
    status: 'Open'
  },
  {
    title: 'Question regarding volume tier discounts for 2027 renewal',
    description: 'We are planning to increase our seat licenses from 120 to 350 next quarter. Could our account manager share the enterprise pricing schedule?',
    customer_email: 'procurement@globaltech.org',
    priority: 'Low',
    status: 'Open'
  },
  {
    title: 'OAuth integration disconnecting every 24 hours',
    description: 'Our Google Calendar sync keeps desyncing daily. We have to manually re-authorize the app each morning.',
    customer_email: 'admin@startupflow.dev',
    priority: 'Medium',
    status: 'In Progress'
  }
];

export function CreateTicketModal({ isOpen, onClose, onCreateTicket, isCreating }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_email: '',
    priority: 'Medium',
    status: 'Open'
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        customer_email: '',
        priority: 'Medium',
        status: 'Open'
      });
      setErrors({});
      setServerError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required.';
    } else if (formData.title.trim().length > 120) {
      newErrors.title = `Title must not exceed 120 characters (${formData.title.trim().length}/120).`;
    }

    // Description validation
    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Description is required.';
    }

    // Customer email validation
    if (!formData.customer_email || formData.customer_email.trim().length === 0) {
      newErrors.customer_email = 'Customer email is required.';
    } else if (!EMAIL_REGEX.test(formData.customer_email.trim())) {
      newErrors.customer_email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    // Priority validation
    if (!['Low', 'Medium', 'High'].includes(formData.priority)) {
      newErrors.priority = 'Priority must be Low, Medium, or High.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      await onCreateTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        customer_email: formData.customer_email.trim(),
        priority: formData.priority,
        status: formData.status || 'Open'
      });
      onClose();
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
      } else {
        setServerError(err.message || 'Failed to create support ticket.');
      }
    }
  };

  const handleApplyTemplate = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEMPLATES.length);
    const template = SAMPLE_TEMPLATES[randomIndex];
    setFormData(template);
    setErrors({});
    setServerError(null);
  };

  const charCount = formData.title.length;
  const isCharWarning = charCount > 100;
  const isCharExceeded = charCount > 120;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Create Support Ticket
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              Add a new customer support inquiry to the queue
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleApplyTemplate}
              title="Populate with sample customer inquiry"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={13} />
              <span>Fill Sample</span>
            </button>

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
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {serverError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Title Field with Character Counter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="create-title" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Title <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: isCharExceeded ? '#f43f5e' : isCharWarning ? '#fbbf24' : 'var(--text-muted)',
                  fontWeight: isCharWarning || isCharExceeded ? 700 : 400
                }}>
                  {charCount} / 120
                </span>
              </div>
              <input
                id="create-title"
                type="text"
                placeholder="Brief summary of the inquiry or issue..."
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: errors.title || isCharExceeded ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  fontSize: '0.875rem'
                }}
              />
              {errors.title && (
                <p style={{ fontSize: '0.775rem', color: '#f87171', marginTop: '0.3rem' }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Customer Email Field */}
            <div>
              <label htmlFor="create-email" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Customer Email <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <input
                id="create-email"
                type="email"
                placeholder="customer@company.com"
                value={formData.customer_email}
                onChange={(e) => {
                  setFormData({ ...formData, customer_email: e.target.value });
                  if (errors.customer_email) setErrors({ ...errors, customer_email: null });
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: errors.customer_email ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  fontSize: '0.875rem'
                }}
              />
              {errors.customer_email && (
                <p style={{ fontSize: '0.775rem', color: '#f87171', marginTop: '0.3rem' }}>
                  {errors.customer_email}
                </p>
              )}
            </div>

            {/* Priority & Status Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Priority */}
              <div>
                <label htmlFor="create-priority" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Priority <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <select
                  id="create-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                {errors.priority && (
                  <p style={{ fontSize: '0.775rem', color: '#f87171', marginTop: '0.3rem' }}>
                    {errors.priority}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="create-status" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Initial Status
                </label>
                <select
                  id="create-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  <option value="Open">Open (Default)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="create-description" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Description <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <textarea
                id="create-description"
                rows={5}
                placeholder="Provide detailed description of the customer's request or issue..."
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: errors.description ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  resize: 'vertical'
                }}
              />
              {errors.description && (
                <p style={{ fontSize: '0.775rem', color: '#f87171', marginTop: '0.3rem' }}>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || isCharExceeded}
              id="btn-submit-ticket"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.3rem',
                borderRadius: 'var(--radius-md)',
                background: isCharExceeded
                  ? 'var(--bg-surface-hover)'
                  : 'linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: isCharExceeded ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.4)',
                cursor: isCreating || isCharExceeded ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={15} />
              <span>{isCreating ? 'Creating Ticket...' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
