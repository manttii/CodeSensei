'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Shield, Zap, Code, Copy, Check, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { ReviewResult, Vulnerability, PerformanceTip } from '@/lib/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const MONACO_LANG: Record<string, string> = {
  Python: 'python', JavaScript: 'javascript', TypeScript: 'typescript',
  Go: 'go', Rust: 'rust', Java: 'java',
  'C++': 'cpp', SQL: 'sql', Bash: 'shell', Other: 'plaintext',
};

// ── Severity / Impact Badge ──────────────────────────────────────────────────
function Badge({ level }: { level: string }) {
  const cls = level === 'HIGH' ? 'badge-high' : level === 'MEDIUM' ? 'badge-medium' : 'badge-low';
  return <span className={`badge ${cls}`}>{level}</span>;
}

// ── Vulnerability Card ───────────────────────────────────────────────────────
function VulnCard({ vuln, index }: { vuln: Vulnerability; index: number }) {
  const border = vuln.severity === 'HIGH' ? 'rgba(248,113,113,0.25)'
               : vuln.severity === 'MEDIUM' ? 'rgba(251,191,36,0.22)'
               : 'rgba(74,222,128,0.2)';
  const bg     = vuln.severity === 'HIGH' ? 'rgba(248,113,113,0.05)'
               : vuln.severity === 'MEDIUM' ? 'rgba(251,191,36,0.05)'
               : 'rgba(74,222,128,0.04)';
  const icon   = vuln.severity === 'HIGH' ? '#f87171' : vuln.severity === 'MEDIUM' ? '#fbbf24' : '#4ade80';

  return (
    <div
      className="animate-fade-in-up"
      style={{
        border: `1px solid ${border}`, background: bg,
        borderRadius: '12px', padding: '16px 18px',
        animationDelay: `${index * 70}ms`, opacity: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <AlertTriangle size={14} color={icon} />
        <Badge level={vuln.severity} />
        {vuln.line != null && (
          <span
            style={{
              fontSize: '11px', color: '#64748b', fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.05)', padding: '1px 7px',
              borderRadius: '5px', border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Line {vuln.line}
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '12px' }}>
        {vuln.description}
      </p>

      {/* Fix */}
      <div
        style={{
          background: 'rgba(74,222,128,0.06)', borderRadius: '8px',
          padding: '10px 14px', borderLeft: '3px solid rgba(74,222,128,0.4)',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '4px' }}>
          Suggested Fix
        </span>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.55' }}>{vuln.fix}</p>
      </div>
    </div>
  );
}

// ── Performance Tip Card ─────────────────────────────────────────────────────
function PerfCard({ tip, index }: { tip: PerformanceTip; index: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.04)',
        borderRadius: '12px', padding: '16px 18px',
        animationDelay: `${index * 70}ms`, opacity: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <TrendingUp size={14} color="#fbbf24" />
        <Badge level={tip.impact} />
      </div>
      <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '10px' }}>
        {tip.description}
      </p>
      <div
        style={{
          background: 'rgba(251,191,36,0.06)', borderRadius: '8px',
          padding: '10px 14px', borderLeft: '3px solid rgba(251,191,36,0.35)',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '4px' }}>
          Suggestion
        </span>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.55' }}>{tip.suggestion}</p>
      </div>
    </div>
  );
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '160px', height: '20px' }} />
      </div>
      {[120, 90, 140].map((h, i) => (
        <div key={i} className="skeleton" style={{ height: `${h}px` }} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
        <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '130px', height: '20px' }} />
      </div>
      {[100, 110].map((h, i) => (
        <div key={i} className="skeleton" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count, iconColor }: { icon: React.ReactNode; label: string; count: number; iconColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ color: iconColor, display: 'flex' }}>{icon}</div>
      <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>{label}</h2>
      <span
        style={{
          fontSize: '12px', color: iconColor, fontWeight: '600',
          background: `rgba(${iconColor.includes('87') ? '248,113,113' : iconColor.includes('fb') ? '251,191,36' : '99,102,241'}, 0.12)`,
          padding: '1px 8px', borderRadius: '10px',
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ── Main ReviewPanel ─────────────────────────────────────────────────────────
interface ReviewPanelProps {
  result: ReviewResult | null;
  isLoading: boolean;
}

export default function ReviewPanel({ result, isLoading }: ReviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!result?.refactored_code) return;
    try {
      await navigator.clipboard.writeText(result.refactored_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* silently fail */ }
  };

  if (isLoading) return <SkeletonLoader />;
  if (!result) {
    return (
      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '60px 24px', flexDirection: 'column', gap: '14px', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '52px', opacity: 0.5 }}>🔍</div>
        <p style={{ color: '#475569', fontSize: '15px', maxWidth: '280px', lineHeight: '1.6' }}>
          Paste your code in the editor above and click <strong style={{ color: '#6366f1' }}>Analyze Code</strong> to get started.
        </p>
      </div>
    );
  }

  const vulns = result.vulnerabilities ?? [];
  const tips  = result.performance_tips ?? [];
  const allClear = vulns.length === 0 && tips.length === 0;

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '36px' }}>

      {/* Meta row */}
      <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Review #{result.review_id} · {result.language} · {result.review_focus}
        </span>
        {result.cached && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '20px', padding: '3px 12px', color: '#818cf8', fontSize: '12px', fontWeight: '500',
            }}
          >
            <Zap size={11} /> Cached — instant
          </span>
        )}
      </div>

      {/* All-clear state */}
      {allClear && (
        <div
          className="animate-fade-in-up"
          style={{
            textAlign: 'center', padding: '48px 32px',
            background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.18)',
            borderRadius: '16px',
          }}
        >
          <div style={{ fontSize: '52px', marginBottom: '14px' }}>✅</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#4ade80', marginBottom: '8px' }}>All Clear!</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>No vulnerabilities or performance issues detected.</p>
        </div>
      )}

      {/* Vulnerabilities */}
      {vulns.length > 0 && (
        <section>
          <SectionHeader
            icon={<Shield size={16} />}
            label="Vulnerabilities"
            count={vulns.length}
            iconColor="#f87171"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vulns.map((v, i) => <VulnCard key={i} vuln={v} index={i} />)}
          </div>
        </section>
      )}

      {/* Performance Tips */}
      {tips.length > 0 && (
        <section>
          <SectionHeader
            icon={<TrendingUp size={16} />}
            label="Performance Tips"
            count={tips.length}
            iconColor="#fbbf24"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tips.map((t, i) => <PerfCard key={i} tip={t} index={i} />)}
          </div>
        </section>
      )}

      {/* Refactored Code */}
      {result.refactored_code && (
        <section className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '300ms' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} color="#818cf8" />
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>
                Refactored Code
              </h2>
            </div>
            <button
              id="copy-refactored-btn"
              onClick={copyCode}
              className="btn-ghost"
              style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}
            >
              {copied ? <><Check size={13} color="#4ade80" /> <span style={{ color: '#4ade80' }}>Copied!</span></> : <><Copy size={13} /> Copy</>}
            </button>
          </div>

          {/* Read-only Monaco */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
            <MonacoEditor
              height="360px"
              language={MONACO_LANG[result.language] ?? 'plaintext'}
              value={result.refactored_code}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 },
                wordWrap: 'on',
                lineNumbers: 'on',
                domReadOnly: true,
              }}
            />
          </div>
        </section>
      )}

      {/* Bottom spacer */}
      <div style={{ height: '24px' }} />
    </div>
  );
}
