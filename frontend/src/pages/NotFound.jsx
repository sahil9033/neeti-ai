import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="big-icon">⚔️</div>
      <h1>404 — Page Not Found</h1>
      <p>This path leads nowhere. Even Chanakya would retreat.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
