import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const recentConflicts = [
  { id: '1', type: 'Workplace', date: 'May 1', summary: 'Colleague taking credit for my work.' },
  { id: '2', type: 'Relationship', date: 'Apr 24', summary: 'Miscommunication causing ongoing tension.' },
  { id: '3', type: '3rd Party', date: 'Apr 18', summary: 'Partner feels unheard in decisions.' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="page dashboard">
      <div className="page-header">
        <div>
          <p className="eyebrow">Welcome</p>
          <h1>Namaste, {user.displayName || user.email?.split('@')[0] || 'Neeti User'}</h1>
        </div>
        <div className="dashboard-actions">
          <button className="button button-primary" onClick={() => navigate('/conflict/new')}>
            Resolve New Conflict
          </button>
          <button className="button button-secondary" onClick={() => navigate('/test')}>
            Test NEETI
          </button>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Recent Conflicts</h2>
        </div>
        <div className="grid-grid">
          {recentConflicts.map((conflict) => (
            <article key={conflict.id} className="card conflict-card">
              <span className="badge">{conflict.type}</span>
              <p className="meta">{conflict.date}</p>
              <h3>{conflict.summary}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
