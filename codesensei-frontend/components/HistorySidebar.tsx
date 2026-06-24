'use client';

import { ReviewHistoryItem } from '@/lib/types';
import { Clock, Shield, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  history: ReviewHistoryItem[];
  isOpen: boolean;
  onSelect: (id: number) => void;
}

const LANG_ICONS: Record<string, string> = {
  Python: '🐍', JavaScript: '🟨', TypeScript: '🔷',
  Go: '🐹', Rust: '🦀', Java: '☕',
  'C++': '⚙️', SQL: '🗄️', Bash: '💻', Other: '📄',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / 3600000;
  if (diffH < 1) return `${Math.round(diffMs / 60000)}m ago`;
  if (diffH < 24) return `${Math.round(diffH)}h ago`;
  if (diffH < 168) return `${Math.round(diffH / 24)}d ago`;
  return d.toLocaleDateString();
}

export default function HistorySidebar({ history, isOpen, onSelect }: HistorySidebarProps) {
  if (!isOpen) return null;

  return (
    <aside
      className="animate-slide-in-left"
      style={{
        width: '280px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#0a0a14',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} color="#64748b" />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Review History
          </span>
          {history.length > 0 && (
            <span
              style={{
                marginLeft: 'auto', background: 'rgba(99,102,241,0.15)',
                color: '#818cf8', fontSize: '11px', fontWeight: '600',
                padding: '1px 8px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              {history.length}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {history.length === 0 ? (
          <div
            style={{
              textAlign: 'center', padding: '40px 16px',
              color: '#475569', fontSize: '13px', lineHeight: '1.6',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
            No reviews yet.
            <br />
            Submit your first code above.
          </div>
        ) : (
          history.map((item, i) => (
            <button
              key={item.id}
              id={`history-item-${item.id}`}
              onClick={() => onSelect(item.id)}
              className="animate-fade-in"
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '10px',
                padding: '10px 12px',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
                animationDelay: `${i * 40}ms`,
                opacity: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.04)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'transparent';
                el.style.borderColor = 'transparent';
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{LANG_ICONS[item.language] ?? '📄'}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>{item.language}</span>
                </div>
                <ChevronRight size={12} color="#475569" />
              </div>

              {/* Focus badge */}
              <div style={{ marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.06em', color: '#6366f1',
                    background: 'rgba(99,102,241,0.1)', padding: '2px 7px',
                    borderRadius: '6px', border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  {item.review_focus}
                </span>
              </div>

              {/* Preview text */}
              <p style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', lineHeight: '1.4', marginBottom: '7px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                {item.preview}
              </p>

              {/* Footer row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#475569' }}>{formatDate(item.created_at)}</span>
                {item.vulnerability_count > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={10} color="#f87171" />
                    <span style={{ fontSize: '11px', color: '#f87171', fontWeight: '600' }}>{item.vulnerability_count}</span>
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
