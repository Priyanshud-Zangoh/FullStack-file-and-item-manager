import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Package, FileText, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '../../stores'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/items',     label: 'Items',     icon: Package },
  { path: '/files',     label: 'Files',     icon: FileText },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">FullStack</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}

        {user?.is_superuser && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
            <span className="nav-item" style={{ cursor: 'default', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-dim)' }}>
              <Shield size={14} /> Admin
            </span>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-icon btn-secondary"
            title="Logout"
            style={{ padding: '6px', marginLeft: 'auto' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
