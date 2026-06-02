import { useAuthStore } from '../../stores'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username}!</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Getting Started</h2>
          </div>
          <div className="card-body">
            <p style={{ color: 'var(--color-text-dim)', marginBottom: '16px' }}>
              Welcome to the FullStack boilerplate. Here's what you can do:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-dim)' }}>
              <li>Manage your items in the <strong>Items</strong> tab.</li>
              <li>Upload and view files in the <strong>Files</strong> tab.</li>
              <li>Explore the FastAPI automatic docs.</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System Status</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
              <span>FastAPI Backend connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
              <span>PostgreSQL Database connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
              <span>MinIO Storage connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
