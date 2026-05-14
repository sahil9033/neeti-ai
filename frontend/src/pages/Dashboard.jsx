import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';
import Sidebar from '../components/Sidebar';
import ConflictCard from '../components/ConflictCard';

const quotes = [
  { text: '"Before you start some work, always ask yourself three questions – Why am I doing it, What the results might be and Will I be successful."', author: '— Chanakya' },
  { text: '"The serpent, the king, the tiger, the stinging wasp, the small child, the dog owned by other people, and the fool: these seven ought not to be awakened from sleep."', author: '— Chanakya' },
  { text: '"A person should not be too honest. Straight trees are cut first and honest people are screwed first."', author: '— Chanakya' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const quote = quotes[new Date().getDate() % quotes.length];

  useEffect(() => {
    getHistory().then((data) => setConflicts(data.slice(0, 3))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-body has-sidebar">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <div className="page-header">
            <div>
              <span className="eyebrow">Dashboard</span>
              <h1>Namaste, {user?.displayName || user?.email?.split('@')[0] || 'User'} 🙏</h1>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/conflict/new')}>⚔️ Resolve New Conflict</button>
          </div>

          <div className="quote-card animate-in">
            <p>{quote.text}</p>
            <p className="author">{quote.author}</p>
          </div>

          <div className="stats-row">
            <div className="card stat-card"><div className="stat-num" style={{ color: 'var(--gold)' }}>{conflicts.length > 0 ? conflicts.length + '+' : '0'}</div><div className="stat-label">Conflicts Analyzed</div></div>
            <div className="card stat-card"><div className="stat-num" style={{ color: 'var(--emerald)' }}>3</div><div className="stat-label">AI Perspectives</div></div>
            <div className="card stat-card"><div className="stat-num" style={{ color: 'var(--sapphire)' }}>∞</div><div className="stat-label">Wisdom Available</div></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Recent Conflicts</h2>
            {conflicts.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>View All →</button>}
          </div>

          {loading ? (
            <div className="grid-2">{[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" />)}</div>
          ) : conflicts.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📜</div>
              <h3>No conflicts yet</h3>
              <p>Start your first conflict resolution journey</p>
              <button className="btn btn-primary" onClick={() => navigate('/conflict/new')}>Resolve Your First Conflict</button>
            </div>
          ) : (
            <div className="grid-2">{conflicts.map((c) => <ConflictCard key={c.id} conflict={c} />)}</div>
          )}
        </div>
      </main>
    </div>
  );
}
