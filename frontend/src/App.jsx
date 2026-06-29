import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import CompleteGoogleAuthPage from './features/auth/pages/CompleteGoogleAuthPage';
import { AuthProvider } from './features/auth/auth.context';
import Protected from './features/auth/components/Protected';
import Public from './features/auth/components/Public';
import AppLayout from './components/AppLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import UploadPage from './features/resume/pages/UploadPage';
import ReportPage from './features/resume/pages/ReportPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Public><LoginPage /></Public>} />
            <Route path="/register" element={<Public><RegisterPage /></Public>} />
            <Route path="/complete-registration" element={<Public><CompleteGoogleAuthPage /></Public>} />

            <Route element={<Protected><AppLayout /></Protected>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analyze" element={<UploadPage />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
