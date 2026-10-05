import React from 'react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, timeAgo, truncateText } from '../utils/formatters';
import { ChevronRight, Mail } from 'lucide-react';

export function TicketTable({ tickets, onSelectTicket }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.875rem'
      }}>
        <thead>
          <tr style={{
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <th style={{ padding: '0.85rem 1.25rem', width: '70px' }}>ID</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Ticket</th>
            <th style={{ padding: '0.85rem 1.25rem', width: '220px' }}>Customer</th>
            <th style={{ padding: '0.85rem 1rem', width: '110px' }}>Priority</th>
            <th style={{ padding: '0.85rem 1rem', width: '130px' }}>Status</th>
            <th style={{ padding: '0.85rem 1.25rem', width: '140px' }}>Created</th>
            <th style={{ padding: '0.85rem 1.25rem', width: '70px', textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => {
            return (
              <tr
                key={ticket.id}
                id={`ticket-row-${ticket.id}`}
                onClick={() => onSelectTicket(ticket)}
                style={{
                  borderBottom: index < tickets.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* ID */}
                <td style={{
                  padding: '1rem 1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  #{ticket.id}
                </td>

                {/* Title & Description */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '0.2rem',
                    lineHeight: 1.3
                  }}>
                    {ticket.title}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.3
                  }}>
                    {truncateText(ticket.description, 75)}
                  </div>
                </td>

                {/* Customer Email */}
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.825rem' }}>{ticket.customer_email}</span>
                  </div>
                </td>

                {/* Priority */}
                <td style={{ padding: '1rem 1rem' }}>
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Status */}
                <td style={{ padding: '1rem 1rem' }}>
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Created At */}
                <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }} title={formatDate(ticket.created_at)}>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    {timeAgo(ticket.created_at)}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {ticket.created_at ? ticket.created_at.slice(0, 10) : ''}
                  </div>
                </td>

                {/* Action arrow */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-secondary)'
                  }}>
                    <ChevronRight size={15} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
