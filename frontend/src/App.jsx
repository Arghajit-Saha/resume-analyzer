import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { AuthProvider } from './features/auth/auth.context';
import Protected from './features/auth/components/Protected';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Protected><h1>Landng Page</h1></Protected>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
