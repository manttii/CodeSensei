'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error details:', err);
      const e = err as AxiosError<{ detail: string }>;
      let msg = e.response?.data?.detail || e.message || 'Registration failed. Please try again.';
      if (e.message === 'Network Error') {
        msg = 'Network Error: Cannot reach the backend. Please check the console logs for details.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#080812',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }}
      />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em' }}>
              ⚡ Code<span className="gradient-text">Sensei</span>
            </span>
          </Link>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
            Create your free account
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: '20px', padding: '36px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#e2e8f0' }}>
            Get started today
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' }}>
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ padding: '11px 14px' }}
              />
            </div>

            <div>
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' }}>
                Password <span style={{ color: '#64748b', fontWeight: '400' }}>(min 8 chars)</span>
              </label>
              <input
                id="reg-password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ padding: '11px 14px' }}
              />
            </div>

            <div>
              <label htmlFor="reg-confirm" style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{ padding: '11px 14px' }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171',
                }}
              >
                {error}
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              className="btn-accent"
              disabled={loading}
              style={{ padding: '12px', fontSize: '15px', marginTop: '4px', width: '100%', borderRadius: '10px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                  Creating account…
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#818cf8', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
