'use client';

import Link from 'next/link';
import { User } from '@/lib/types';
import { PanelLeft, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ user, onLogout, sidebarOpen, onToggleSidebar }: NavbarProps) {
  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <header
      style={{
        height: '57px',
        backgroundColor: '#0a0a14',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Left: toggle + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{
            width: '32px', height: '32px',
            borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
            background: sidebarOpen ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: sidebarOpen ? '#818cf8' : '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.18s ease',
          }}
        >
          <PanelLeft size={15} />
        </button>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.02em', color: '#e2e8f0' }}>
            Code<span className="gradient-text">Sensei</span>
          </span>
        </Link>
      </div>

      {/* Right: user avatar + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1 }}>
                {user.email}
              </span>
            </div>
            {/* Avatar */}
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '13px', color: '#fff', flexShrink: 0,
              }}
            >
              {initials}
            </div>
          </div>
        )}

        <button
          id="logout-btn"
          onClick={onLogout}
          className="btn-ghost"
          title="Log out"
          style={{ padding: '6px 12px', fontSize: '13px', gap: '6px' }}
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  );
}
