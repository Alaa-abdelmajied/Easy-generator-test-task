import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />}
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
