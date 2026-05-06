import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/conflict/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.success) {
          setConflicts(response.data.conflicts);
        }
      } catch (err) {
        console.error('History fetch error:', err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <main className="page history-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Conflict Records</span>
          <h1>Your history</h1>
        </div>
      </div>

      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && conflicts.length === 0 && <p>No conflicts found. Start a new one!</p>}

      <div className="grid-grid">
        {conflicts.map((item) => (
          <article key={item.id} className="card conflict-card">
            <div className="card-header">
              <span className="badge">{item.conflictType}</span>
              <span className="meta">{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
            </div>
            <p>{item.description.substring(0, 100)}...</p>
            <Link to={`/conflict/${item.id}`} className="button button-secondary small">
              View
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
