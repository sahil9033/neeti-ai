import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { title: 'Chanakya Mode', description: 'Strategic, ruthless, outcome-focused analysis.' },
  { title: 'Therapist Mode', description: 'Empathetic insights into emotions and healing.' },
  { title: 'Mediator Mode', description: 'Balanced resolutions that keep both sides aligned.' }
];

const steps = [
  { label: 'Describe', description: 'Explain your conflict clearly.' },
  { label: 'Analyze', description: 'NEETI evaluates strategy, feelings, and resolution.' },
  { label: 'Resolve', description: 'Get a clear plan and path forward.' }
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <main className="page landing">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">NEETI</span>
          <h1>Ancient Wisdom. Modern Conflicts.</h1>
          <p className="hero-copy">Activate the conflict engine and receive strategy, empathy, and fairness in one intelligent response.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => navigate(user ? '/dashboard' : '/auth')}>
              Resolve a Conflict
            </button>
            {user && (
              <button className="button button-secondary" onClick={() => navigate('/test')}>
                Test NEETI
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="section cards-grid">
        {features.map((feature) => (
          <article key={feature.title} className="card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="section steps-grid">
        <h2>How It Works</h2>
        <div className="step-cards">
          {steps.map((step) => (
            <div key={step.label} className="card step-card">
              <strong>{step.label}</strong>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
