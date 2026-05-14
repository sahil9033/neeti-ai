import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '⚔️', title: 'Chanakya Mode', desc: 'Cold, strategic, outcome-focused. The Arthashastra applied to your life.' },
  { icon: '💙', title: 'Therapist Mode', desc: 'Empathetic insights into emotions, patterns, and paths to healing.' },
  { icon: '⚖️', title: 'Mediator Mode', desc: 'Balanced resolutions drawing from Stoicism and negotiation theory.' },
];

const steps = [
  { num: 1, title: 'Describe', desc: 'Tell NEETI about your conflict — workplace, family, relationship, or any kind.' },
  { num: 2, title: 'Analyze', desc: 'Three AI perspectives evaluate your situation simultaneously in parallel.' },
  { num: 3, title: 'Resolve', desc: 'Get a clear action plan combining strategy, empathy, and fairness.' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const target = user ? '/dashboard' : '/auth';

  return (
    <main className="page landing">
      <section className="hero">
        <span className="eyebrow">AI Conflict Resolution</span>
        <h1>
          <span className="accent">Ancient Wisdom.</span><br />
          Modern Conflicts.
        </h1>
        <p className="hero-sub">
          Three AI perspectives — a strategist, a therapist, and a mediator — analyze your conflict and deliver a clear path forward.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate(target)}>
            Resolve a Conflict ⚔️
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(target)}>
            Learn More
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2>Three Modes. One Resolution.</h2>
        <div className="grid-3">
          {features.map((f) => (
            <article key={f.title} className="card card-glow feature-card animate-in">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-section">
        <h2>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((s) => (
            <div key={s.num} className="card step-card">
              <div className="step-num">{s.num}</div>
              <div>
                <strong>{s.title}</strong>
                <p style={{ color: 'var(--text2)', marginTop: '4px', fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner animate-in">
        <h2>Ready to resolve your conflict?</h2>
        <p>Join NEETI and get AI-powered guidance rooted in ancient wisdom.</p>
        <button className="btn btn-primary" onClick={() => navigate(target)}>
          Start Resolving — Free
        </button>
      </section>
    </main>
  );
}
