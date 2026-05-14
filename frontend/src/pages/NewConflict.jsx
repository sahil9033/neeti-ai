import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeConflict } from '../services/api';
import Sidebar from '../components/Sidebar';

const types = [
  { value: 'family', icon: '👨‍👩‍👧‍👦', label: 'Family' },
  { value: 'workplace', icon: '💼', label: 'Workplace' },
  { value: 'relationship', icon: '❤️', label: 'Relationship' },
  { value: 'business', icon: '🤝', label: 'Business' },
  { value: 'social', icon: '🌐', label: 'Social' },
];
const tones = [
  { value: 'diplomatic', icon: '🕊️', label: 'Diplomatic', desc: 'Gentle and tactful' },
  { value: 'balanced', icon: '⚖️', label: 'Balanced', desc: 'Fair and moderate' },
  { value: 'blunt', icon: '🔥', label: 'Blunt', desc: 'Direct and unfiltered' },
];
const loadingTexts = ['Consulting Chanakya...', 'Reading your emotions...', 'Finding the middle path...', 'Weighing both sides...'];

export default function NewConflict() {
  const [step, setStep] = useState(1);
  const [conflictType, setConflictType] = useState('workplace');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('balanced');
  const [submitting, setSubmitting] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!submitting) return;
    const interval = setInterval(() => setLoadingIdx((i) => (i + 1) % loadingTexts.length), 2000);
    return () => clearInterval(interval);
  }, [submitting]);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await analyzeConflict(description, conflictType, tone);
      navigate(`/conflict/${result.id}`);
    } catch (err) {
      if (err.response?.status === 429) setError('Our wisdom needs a moment — please try again in 1 minute.');
      else setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="app-body has-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="om-spinner">ॐ</div>
            <p className="loading-text">{loadingTexts[loadingIdx]}</p>
            <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>This may take 10-20 seconds...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-body has-sidebar">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <div className="page-header">
            <div>
              <span className="eyebrow">New Conflict</span>
              <h1>What's troubling you?</h1>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= s ? 'var(--gold)' : 'var(--glass2)' }} />
              ))}
            </div>
          </div>

          {error && <div className="error-box" style={{ marginBottom: '20px' }}>{error}</div>}

          <div className="glass-panel animate-in">
            {step === 1 && (
              <>
                <h2 style={{ marginBottom: '20px' }}>Choose conflict type</h2>
                <div className="grid-3" style={{ marginBottom: '24px' }}>
                  {types.map((t) => (
                    <button key={t.value} className={`pill${conflictType === t.value ? ' active' : ''}`} onClick={() => setConflictType(t.value)}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{t.icon}</div>
                      {t.label}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ marginBottom: '20px' }}>Describe your situation</h2>
                <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder="Write what happened, who is involved, and what you want to resolve..." />
                <div className="char-count">{description.length}/2000</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!description.trim()}>Next →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ marginBottom: '20px' }}>Select a tone</h2>
                <div className="grid-3" style={{ marginBottom: '24px' }}>
                  {tones.map((t) => (
                    <button key={t.value} className={`pill${tone === t.value ? ' active' : ''}`} onClick={() => setTone(t.value)}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{t.icon}</div>
                      <strong>{t.label}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '4px' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary" onClick={handleSubmit}>Analyze with NEETI ⚔️</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
