import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main className="page settings-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>Account settings</h1>
        </div>
      </div>

      <div className="card profile-card">
        <p><strong>Name</strong></p>
        <p>{user.displayName || 'NEETI user'}</p>
        <p><strong>Email</strong></p>
        <p>{user.email}</p>
        <button className="button button-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}
