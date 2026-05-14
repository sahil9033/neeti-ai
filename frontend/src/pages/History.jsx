import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteConflict } from '../services/api';
import Sidebar from '../components/Sidebar';
import ConflictCard from '../components/ConflictCard';

export default function History() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(setConflicts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = conflicts;
    if (filterType !== 'all') result = result.filter((c) => c.conflictType === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.description?.toLowerCase().includes(q));
    }
    return result;
  }, [conflicts, search, filterType]);

  const handleDelete = async (id) => {
    try {
      await deleteConflict(id);
      setConflicts((prev) => prev.filter((c) => c.id !== id));
      setConfirmId(null);
    } catch { setConfirmId(null); }
  };

  return (
    <div className="app-body has-sidebar">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <div className="page-header">
            <div>
              <span className="eyebrow">Conflict Records</span>
              <h1>Your History</h1>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/conflict/new')}>+ New Conflict</button>
          </div>

          <div className="history-controls">
            <input className="form-input" placeholder="Search conflicts..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="family">Family</option>
              <option value="workplace">Workplace</option>
              <option value="relationship">Relationship</option>
              <option value="business">Business</option>
              <option value="social">Social</option>
            </select>
          </div>

          {loading ? (
            <div className="grid-2">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton skeleton-card" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📜</div>
              <h3>{conflicts.length === 0 ? 'No conflicts yet' : 'No matches found'}</h3>
              <p>{conflicts.length === 0 ? '"The wise man does at once what the fool does finally." — Chanakya' : 'Try adjusting your search or filter.'}</p>
              {conflicts.length === 0 && <button className="btn btn-primary" onClick={() => navigate('/conflict/new')}>Resolve Your First Conflict</button>}
            </div>
          ) : (
            <div className="grid-2">
              {filtered.map((c) => <ConflictCard key={c.id} conflict={c} onDelete={(id) => setConfirmId(id)} />)}
            </div>
          )}
        </div>
      </main>

      {confirmId && (
        <div className="confirm-overlay" onClick={() => setConfirmId(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Conflict?</h3>
            <p>This will permanently remove this conflict and its analysis.</p>
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
