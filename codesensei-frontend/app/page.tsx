import Link from 'next/link';

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#080812',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          className="animate-blob"
          style={{
            position: 'absolute', top: '-10%', left: '10%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="animate-blob"
          style={{
            position: 'absolute', bottom: '-10%', right: '5%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '3s',
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}>
            Code<span className="gradient-text">Sensei</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login">
            <button className="btn-ghost" style={{ padding: '8px 20px' }}>Sign In</button>
          </Link>
          <Link href="/register">
            <button className="btn-accent" style={{ padding: '8px 20px' }}>Get Started →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          flex: 1, position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          padding: '80px 24px 60px',
        }}
      >
        {/* Label chip */}
        <div
          className="animate-fade-in"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '32px',
            fontSize: '13px', color: '#818cf8', fontWeight: '500',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
          Powered by Google Gemini 1.5 Flash
        </div>

        {/* Title */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: '800',
            letterSpacing: '-0.04em', lineHeight: '1.05',
            marginBottom: '24px',
          }}
        >
          <span className="gradient-text">AI Code Review</span>
          <br />
          <span style={{ color: '#e2e8f0' }}>That Actually Ships</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up delay-100"
          style={{
            fontSize: '18px', color: '#94a3b8', maxWidth: '560px',
            lineHeight: '1.7', marginBottom: '40px', opacity: 0,
          }}
        >
          Paste your code. Get structured vulnerability reports, performance
          tips, and a refactored version — all in under 3 seconds.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          <Link href="/register">
            <button
              className="btn-accent animate-pulse-glow"
              style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}
            >
              Start Reviewing Free →
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-ghost" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}>
              Sign In
            </button>
          </Link>
        </div>

        {/* Feature badges */}
        <div
          className="animate-fade-in-up delay-300"
          style={{
            display: 'flex', gap: '12px', marginTop: '56px',
            flexWrap: 'wrap', justifyContent: 'center', opacity: 0,
          }}
        >
          {[
            { icon: '🔒', text: 'Prompt Injection Safe' },
            { icon: '⚡', text: 'SHA-256 Caching' },
            { icon: '🛡️', text: 'Rate Limited API' },
            { icon: '🎨', text: 'Monaco Editor' },
            { icon: '🐳', text: 'Docker Ready' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', padding: '7px 14px', fontSize: '13px', color: '#94a3b8',
              }}
            >
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div
          className="animate-fade-in-up delay-400"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px', maxWidth: '900px', width: '100%', marginTop: '80px', opacity: 0,
          }}
        >
          {[
            {
              icon: '🛡️',
              title: 'Vulnerability Detection',
              desc: 'Identifies security flaws with severity ratings (HIGH/MEDIUM/LOW) and specific line numbers.',
              color: '#f87171',
            },
            {
              icon: '⚡',
              title: 'Performance Analysis',
              desc: 'Surfaces bottlenecks and algorithmic inefficiencies with actionable optimization suggestions.',
              color: '#fbbf24',
            },
            {
              icon: '✨',
              title: 'Auto Refactoring',
              desc: 'Returns a complete, improved version of your code in a read-only Monaco editor with copy button.',
              color: '#818cf8',
            },
          ].map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="glass"
              style={{
                borderRadius: '16px', padding: '28px 24px', textAlign: 'left',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{icon}</div>
              <h3 style={{ fontWeight: '600', fontSize: '16px', color, marginBottom: '10px' }}>{title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.65' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '13px', color: '#475569',
        }}
      >
        Built with ⚡ by CodeSensei &mdash; <code style={{ color: '#6366f1' }}># import antigravity</code>
      </footer>
    </main>
  );
}
