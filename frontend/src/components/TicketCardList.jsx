import React from 'react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, timeAgo } from '../utils/formatters';
import { Mail, Clock, ChevronRight } from 'lucide-react';

export function TicketCardList({ tickets, onSelectTicket }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          id={`ticket-card-${ticket.id}`}
          onClick={() => onSelectTicket(ticket)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-highlight)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Card Top: ID and Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.65rem'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}>
              #{ticket.id}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          {/* Title */}
          <h4 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '0.4rem',
            lineHeight: 1.35
          }}>
            {ticket.title}
          </h4>

          {/* Description snippet */}
          <p style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.85rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {ticket.description}
          </p>

          {/* Footer: Customer & Time */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.775rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={12} />
              <span>{ticket.customer_email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={12} />
              <span>{timeAgo(ticket.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
