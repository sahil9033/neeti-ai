import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/conflict/new', icon: '⚔️', label: 'New Conflict' },
  { to: '/history', icon: '📜', label: 'History' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        <div className="sidebar-spacer" />
        <div className="sidebar-user">
          <p className="name">{user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
          <p>{user?.email}</p>
        </div>
        <button className="sidebar-link" onClick={handleLogout}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
