import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="brand" onClick={() => navigate('/')}>NEETI</div>
      <nav className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">History</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/test">Test</Link>
          </>
        ) : (
          <Link to="/auth" className="button button-secondary">Login</Link>
        )}
      </nav>
      {user && <div className="user-chip">{user.email?.split('@')[0] || 'User'}</div>}
    </header>
  );
}
