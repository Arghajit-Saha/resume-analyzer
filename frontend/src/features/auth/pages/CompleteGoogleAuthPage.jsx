import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useToast } from '../../../components/ToastContext';

export default function CompleteGoogleAuthPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleGoogleRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const registrationToken = location.state?.registrationToken;

  useEffect(() => {
    if (!registrationToken) {
      // If someone navigates here directly without a token, send them back to login
      navigate('/login', { replace: true });
    }
  }, [registrationToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      addToast({ type: 'warning', message: 'Please enter a password.' });
      return;
    }
    
    setLoading(true);
    try {
      await handleGoogleRegister(registrationToken, password);
      addToast({ type: 'success', message: 'Account created successfully!' });
      navigate('/');
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to complete registration. Session may have expired.' });
      navigate('/register');
    } finally {
      setLoading(false);
    }
  };

  if (!registrationToken) return null; // Wait for redirect if no token

  return (
    <AuthLayout mode="register">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-heading">Complete Registration</h3>
          <p className="text-body text-[15px]">Please set a secure password for your new account.</p>
        </div>
        
        <InputField
          id="new-password" label="New Password" type="password" placeholder="Enter a secure password"
          onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
        />
        
        <SubmitButton loading={loading}>Complete Sign Up</SubmitButton>

        <div className="flex items-center justify-center mt-2">
          <p className="text-[14px] text-body">
            Changed your mind? <Link to="/login" className="font-semibold text-accent hover:text-accent-hover hover:underline transition-colors">Go back</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
