import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>EasyGenerator</h2>
        <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto', padding: '8px 16px' }}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome to the application</h1>
          <p>You have successfully signed in.</p>

          <div className="user-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
