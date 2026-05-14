import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">NEETI</Link>
      <nav className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">History</Link>
          </>
        ) : (
          <Link to="/auth" className="btn btn-secondary btn-sm">Login</Link>
        )}
      </nav>
      {user && <div className="user-chip">{user.displayName || user.email?.split('@')[0] || 'User'}</div>}
    </header>
  );
}
