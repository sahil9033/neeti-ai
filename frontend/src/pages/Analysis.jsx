import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConflict, sendFollowUp } from '../services/api';
import Sidebar from '../components/Sidebar';

const tabConfig = [
  { key: 'chanakya', icon: '⚔️', label: 'Chanakya' },
  { key: 'therapist', icon: '💙', label: 'Therapist' },
  { key: 'mediator', icon: '⚖️', label: 'Mediator' },
];

export default function Analysis() {
  const { id } = useParams();
  const [tab, setTab] = useState('chanakya');
  const [conflict, setConflict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followQ, setFollowQ] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    getConflict(id)
      .then((data) => { setConflict(data); setFollowUps(data.followUps || []); })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load analysis'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollowUp = async () => {
    if (!followQ.trim() || followLoading) return;
    setFollowLoading(true);
    try {
      const result = await sendFollowUp(id, followQ, tab);
      setFollowUps((prev) => [...prev, { question: followQ, answer: result.answer, mode: tab, createdAt: new Date().toISOString() }]);
      setFollowQ('');
    } catch (err) {
      setError(err.response?.data?.error || 'Follow-up failed');
    } finally { setFollowLoading(false); }
  };

  const actionPlanItems = conflict
    ? Array.isArray(conflict.actionPlan) ? conflict.actionPlan
      : typeof conflict.actionPlan === 'string'
        ? conflict.actionPlan.split(/\r?\n/).map((l) => l.replace(/^([\d]+[\.)]|[-*])\s*/, '').trim()).filter(Boolean)
        : []
    : [];

  if (loading) {
    return (
      <div className="app-body has-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="om-spinner">ॐ</div>
            <p className="loading-text">Loading analysis...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !conflict) {
    return (
      <div className="app-body has-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="page"><div className="error-box">{error || 'Conflict not found.'}</div><Link to="/history" className="btn btn-secondary" style={{ marginTop: '16px', display: 'inline-block' }}>← Back to History</Link></div>
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
              <span className="eyebrow">
                <Link to="/history" style={{ color: 'var(--text3)' }}>History</Link> → Analysis
              </span>
              <h1>Conflict Review</h1>
            </div>
            <span className="badge badge-gold">{conflict.conflictType}</span>
          </div>

          {conflict.summary && (
            <div className="card animate-in" style={{ marginBottom: '24px', borderLeft: '3px solid var(--gold)' }}>
              <p style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{conflict.summary}</p>
            </div>
          )}

          <div className="tabs">
            {tabConfig.map((t) => (
              <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="card animate-in" style={{ marginBottom: '24px' }}>
            <div className="analysis-content">{conflict[tab] || 'No analysis available for this mode.'}</div>
          </div>

          {actionPlanItems.length > 0 && (
            <div className="action-plan card animate-in">
              <h3>📋 Action Plan</h3>
              <ol>
                {actionPlanItems.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>
          )}

          <div className="followup-section">
            <h3>💬 Follow-up Question</h3>
            <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '12px' }}>Ask in the context of the <strong style={{ color: 'var(--gold)' }}>{tab}</strong> perspective</p>
            <div className="followup-input">
              <input className="form-input" value={followQ} onChange={(e) => setFollowQ(e.target.value)} placeholder="Ask a follow-up question..." onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()} disabled={followLoading} />
              <button className="btn btn-primary btn-sm" onClick={handleFollowUp} disabled={followLoading || !followQ.trim()}>
                {followLoading ? '...' : 'Ask'}
              </button>
            </div>

            {followUps.length > 0 && (
              <div className="followup-list">
                {followUps.map((fu, i) => (
                  <div key={i} className="followup-item">
                    <div className="q">Q ({fu.mode}): {fu.question}</div>
                    <div className="a">{fu.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '32px' }}>
            <Link to="/history" className="btn btn-ghost">← Back to History</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
