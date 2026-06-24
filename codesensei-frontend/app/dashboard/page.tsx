'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getReviewHistory, submitReview, getReview, logoutUser } from '@/lib/api';
import { User, ReviewHistoryItem, ReviewResult } from '@/lib/types';
import { AxiosError } from 'axios';
import Navbar from '@/components/Navbar';
import HistorySidebar from '@/components/HistorySidebar';
import EditorPanel from '@/components/EditorPanel';
import ReviewPanel from '@/components/ReviewPanel';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Load user + history on mount
  useEffect(() => {
    Promise.all([getCurrentUser(), getReviewHistory()])
      .then(([userRes, histRes]) => {
        setUser(userRes.data);
        setHistory(histRes.data);
      })
      .catch(() => router.push('/login'))
      .finally(() => setInitializing(false));
  }, [router]);

  const refreshHistory = useCallback(async () => {
    try {
      const res = await getReviewHistory();
      setHistory(res.data);
    } catch {
      // silently fail
    }
  }, []);

  // Submit new review
  const handleSubmit = async (code: string, language: string, focus: string) => {
    setIsLoading(true);
    setReviewError('');
    setReviewResult(null);
    try {
      const res = await submitReview(code, language, focus);
      setReviewResult(res.data);
      await refreshHistory();
    } catch (err) {
      const e = err as AxiosError<{ detail: string }>;
      setReviewError(e.response?.data?.detail ?? 'Review failed. Check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load a review from history
  const handleHistorySelect = async (id: number) => {
    setIsLoading(true);
    setReviewError('');
    try {
      const res = await getReview(id);
      const d = res.data;
      setReviewResult({
        review_id: d.id,
        cached: true,
        language: d.language,
        review_focus: d.review_focus,
        vulnerabilities: d.vulnerabilities,
        performance_tips: d.performance_tips,
        refactored_code: d.refactored_code,
      });
    } catch {
      setReviewError('Could not load that review.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser().catch(() => {});
    router.push('/login');
  };

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#080812', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span className="animate-spin" style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', display: 'inline-block' }} />
          <p style={{ color: '#64748b', fontSize: '14px' }}>Loading CodeSensei…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080812', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 57px)' }}>
        {/* Sidebar */}
        <HistorySidebar
          history={history}
          isOpen={sidebarOpen}
          onSelect={handleHistorySelect}
        />

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <EditorPanel
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={reviewError}
          />
          <ReviewPanel
            result={reviewResult}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
