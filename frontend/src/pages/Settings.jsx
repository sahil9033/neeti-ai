import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const initials = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="app-body has-sidebar">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <div className="page-header">
            <div>
              <span className="eyebrow">Account</span>
              <h1>Settings</h1>
            </div>
          </div>

          <div className="settings-section">
            <h2>Profile</h2>
            <div className="card profile-info">
              <div className="avatar-circle">{initials}</div>
              <div className="profile-details">
                <p className="label">Name</p>
                <p className="value">{user?.displayName || 'NEETI User'}</p>
                <p className="label" style={{ marginTop: '10px' }}>Email</p>
                <p className="value">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Danger Zone</h2>
            <div className="danger-zone">
              <h3>⚠️ Account Actions</h3>
              <p style={{ color: 'var(--text2)', marginBottom: '16px', fontSize: '0.9rem' }}>Logging out will end your current session.</p>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
