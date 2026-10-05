import React from 'react';
import { ArrowDown, ArrowUp, Flame } from 'lucide-react';

export function PriorityBadge({ priority }) {
  const getDetails = () => {
    switch (priority) {
      case 'High':
        return {
          icon: <Flame size={12} strokeWidth={2.5} />,
          color: 'var(--priority-high-text)',
          bg: 'var(--priority-high-bg)',
          border: 'var(--priority-high-border)'
        };
      case 'Medium':
        return {
          icon: <ArrowUp size={12} strokeWidth={2.5} />,
          color: 'var(--priority-med-text)',
          bg: 'var(--priority-med-bg)',
          border: 'var(--priority-med-border)'
        };
      case 'Low':
      default:
        return {
          icon: <ArrowDown size={12} strokeWidth={2.5} />,
          color: 'var(--priority-low-text)',
          bg: 'var(--priority-low-bg)',
          border: 'var(--priority-low-border)'
        };
    }
  };

  const { icon, color, bg, border } = getDetails();

  return (
    <span
      className="badge"
      style={{
        color: color,
        backgroundColor: bg,
        border: `1px solid ${border}`
      }}
    >
      {icon}
      {priority || 'Low'}
    </span>
  );
}
