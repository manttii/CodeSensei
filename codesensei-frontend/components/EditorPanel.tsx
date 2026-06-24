'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Zap, ChevronDown } from 'lucide-react';

// Monaco editor — browser only, no SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="skeleton" style={{ height: '400px', borderRadius: '0' }} />
  ),
});

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'SQL', 'Bash', 'Other'];
const FOCUSES   = ['Full Audit', 'Security', 'Performance', 'Code Style', 'Bug Detection'];
const MAX_CHARS = 8000;

// Map display names → Monaco language IDs
const MONACO_LANG: Record<string, string> = {
  Python: 'python', JavaScript: 'javascript', TypeScript: 'typescript',
  Go: 'go', Rust: 'rust', Java: 'java',
  'C++': 'cpp', SQL: 'sql', Bash: 'shell', Other: 'plaintext',
};

interface EditorPanelProps {
  onSubmit: (code: string, language: string, focus: string) => void;
  isLoading: boolean;
  error: string;
}

export default function EditorPanel({ onSubmit, isLoading, error }: EditorPanelProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [focus, setFocus] = useState('Full Audit');

  const charCount = code.length;
  const charPct   = (charCount / MAX_CHARS) * 100;
  const charColor = charPct > 90 ? '#f87171' : charPct > 70 ? '#fbbf24' : '#64748b';

  const handleChange = useCallback((val: string | undefined) => {
    const v = val ?? '';
    setCode(v.slice(0, MAX_CHARS));
  }, []);

  const handleSubmit = () => {
    if (!code.trim() || isLoading) return;
    onSubmit(code, language, focus);
  };

  return (
    <div style={{ backgroundColor: '#0a0a14', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexWrap: 'wrap', gap: '10px',
        }}
      >
        {/* Left: label + dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>Code Editor</span>

          {/* Language selector */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              id="language-select"
              className="select-field"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{ padding: '6px 32px 6px 10px', minWidth: '130px' }}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Focus selector */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              id="focus-select"
              className="select-field"
              value={focus}
              onChange={e => setFocus(e.target.value)}
              style={{ padding: '6px 32px 6px 10px', minWidth: '140px' }}
            >
              {FOCUSES.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: char counter */}
        <div
          style={{
            fontSize: '12px', fontWeight: '500', color: charColor,
            fontFamily: 'monospace', transition: 'color 0.2s',
          }}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          {/* Progress bar */}
          <div style={{ height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', marginTop: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(charPct, 100)}%`, background: charColor, transition: 'width 0.15s, background 0.2s', borderRadius: '2px' }} />
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height="400px"
        language={MONACO_LANG[language] ?? 'plaintext'}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          cursorBlinking: 'expand',
          smoothScrolling: true,
          wordWrap: 'on',
          tabSize: 2,
        }}
      />

      {/* Footer: error + submit */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', gap: '12px', flexWrap: 'wrap',
        }}
      >
        {/* Error message */}
        {error ? (
          <span
            style={{
              fontSize: '13px', color: '#f87171',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '8px', padding: '6px 12px',
            }}
          >
            ⚠ {error}
          </span>
        ) : (
          <span style={{ fontSize: '12px', color: '#475569' }}>
            Paste code above, then hit Analyze
          </span>
        )}

        {/* Submit button */}
        <button
          id="analyze-btn"
          className="btn-accent"
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          style={{ padding: '10px 24px', fontSize: '14px', minWidth: '160px' }}
        >
          {isLoading ? (
            <>
              <span
                className="animate-spin"
                style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block', flexShrink: 0,
                }}
              />
              Analyzing…
            </>
          ) : (
            <>
              <Zap size={14} />
              Analyze Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
