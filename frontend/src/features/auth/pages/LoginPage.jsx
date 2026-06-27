import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useToast } from '../../../components/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'warning', message: 'Please enter your email and password.' });
      return;
    }

    setLoading(true);
    try {
      await handleLogin({ email, password });
      addToast({ type: 'success', title: 'Welcome back!', message: 'Successfully signed in.' });
      navigate('/');
    } catch {
      addToast({ type: 'error', title: 'Sign in failed', message: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <form className="flex flex-col gap-6" id="login-form" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-5">
          <InputField
            id="login-email" label="Email address" type="email" placeholder="you@example.com"
            onChange={(e) => { setEmail(e.target.value) }} autoComplete="email"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          />
          <InputField
            id="login-password" label="Password" type="password" placeholder="Enter your password"
            onChange={(e) => { setPassword(e.target.value) }} autoComplete="current-password"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-[14px] text-body select-none group" id="remember-me-label">
            <input type="checkbox" id="remember-me" className="peer sr-only" />
            <span className="w-4.5 h-4.5 border-[1.5px] border-edge-mid rounded-[5px] bg-input relative shrink-0 transition-all peer-checked:bg-accent peer-checked:border-accent peer-focus-visible:shadow-[0_0_0_3px_var(--color-accent-ring)] after:content-[''] after:absolute after:left-[5px] after:top-[2px] after:w-[5px] after:h-[9px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45 after:opacity-0 peer-checked:after:opacity-100" />
            <span className="font-medium">Remember me</span>
          </label>
          <a href="#" className="text-[14px] font-semibold text-accent no-underline transition-colors duration-200 hover:text-accent-hover hover:underline" id="forgot-password-link">Forgot password?</a>
        </div>

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
