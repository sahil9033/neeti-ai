import { useNavigate } from 'react-router-dom';

export default function ConflictCard({ conflict, onDelete }) {
  const navigate = useNavigate();

  const date = conflict.createdAt?.seconds
    ? new Date(conflict.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : conflict.createdAt?._seconds
      ? new Date(conflict.createdAt._seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Recent';

  const summary = conflict.description?.length > 100
    ? conflict.description.substring(0, 100) + '...'
    : conflict.description;

  return (
    <article className="card card-glow conflict-card" onClick={() => navigate(`/conflict/${conflict.id}`)}>
      <div className="card-top">
        <span className="badge badge-gold">{conflict.conflictType || 'general'}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{date}</span>
      </div>
      <p className="summary">{summary}</p>
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/conflict/${conflict.id}`)}>
          View
        </button>
        {onDelete && (
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(conflict.id)}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
