import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useToast } from '../../../components/ToastContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { handleLogin, handleGoogleVerify } = useAuth();
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await handleGoogleVerify(tokenResponse.access_token);
        
        if (res.status === 202 && res.data.requiresPassword) {
          addToast({ type: 'info', message: 'Please set a password to complete registration.' });
          navigate('/complete-registration', { state: { registrationToken: res.data.registrationToken } });
        } else {
          addToast({ type: 'success', message: 'Successfully signed in with Google.' });
          navigate('/');
        }
      } catch (error) {
        addToast({ type: 'error', message: 'Google authentication failed.' });
      }
    },
    onError: () => addToast({ type: 'error', message: 'Google Login Failed' })
  });

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

        <div className="flex items-center mt-6 mb-4">
          <div className="flex-1 border-t border-edge-mid"></div>
          <span className="px-3 text-body text-sm font-medium">Or continue with</span>
          <div className="flex-1 border-t border-edge-mid"></div>
        </div>

        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full py-3.5 px-6 text-[15px] font-semibold font-sans text-heading bg-white dark:bg-black border-[1.5px] border-edge-mid rounded-xl cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden hover:bg-black/5 dark:hover:bg-white/5 hover:border-edge active:scale-[0.98] group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center justify-center mt-2">
          <p className="text-[14px] text-body">
            Don't have an account? <Link to="/register" className="font-semibold text-accent hover:text-accent-hover hover:underline transition-colors">Sign up</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
