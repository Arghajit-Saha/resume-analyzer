import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useToast } from '../../../components/ToastContext';

const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: 'transparent', level: 0 };
  let score = 0;
  if (pass.length > 7) score += 1;
  if (pass.match(/[A-Z]/)) score += 1;
  if (pass.match(/[0-9]/)) score += 1;
  if (pass.match(/[^a-zA-Z0-9]/)) score += 1;

  if (score < 2) return { score, label: 'Weak', color: 'var(--color-error)', level: 1 };
  if (score < 3) return { score, label: 'Fair', color: 'var(--color-warning)', level: 2 };
  if (score < 4) return { score, label: 'Good', color: 'var(--color-sky)', level: 3 };
  return { score, label: 'Strong', color: 'var(--color-success)', level: 4 };
};

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password || !confirmPassword) {
      addToast({ type: 'warning', message: 'Please fill in all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      addToast({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      await handleRegister({ firstName, lastName, email, password });
      addToast({ type: 'success', title: 'Account created!', message: 'Welcome to Resumé.' });
      navigate('/');
    } catch {
      addToast({ type: 'error', title: 'Registration failed', message: 'Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  const userIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  const mailIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
  const lockIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
  const shieldIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

  return (
    <AuthLayout mode="register">
      <form className="flex flex-col gap-6" id="register-form" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4.5">
          <div className="flex gap-4 max-sm:flex-col">
            <InputField id="register-first-name" label="First name" type="text" placeholder="John" onChange={(e) => { setFirstName(e.target.value) }} autoComplete="given-name" icon={userIcon} />
            <InputField id="register-last-name" label="Last name" type="text" placeholder="Doe (Optional)" onChange={(e) => { setLastName(e.target.value) }} autoComplete="family-name" icon={userIcon} />
          </div>
          <InputField id="register-email" label="Email address" type="email" placeholder="you@example.com" onChange={(e) => { setEmail(e.target.value) }} autoComplete="email" icon={mailIcon} />
          <InputField id="register-password" label="Password" type="password" placeholder="Create a strong password" onChange={(e) => { setPassword(e.target.value) }} autoComplete="new-password" icon={lockIcon} />

          {password && (
            <div className="flex items-center gap-3 animate-fade-in" id="password-strength">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i <= strength.level ? strength.color : 'var(--color-edge)' }} />
                ))}
              </div>
              <span className="text-[12px] font-semibold min-w-[50px] text-right" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <InputField id="register-confirm-password" label="Confirm password" type="password" placeholder="Re-enter your password" onChange={(e) => { setConfirmPassword(e.target.value) }} autoComplete="new-password" icon={shieldIcon} />
        </div>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
