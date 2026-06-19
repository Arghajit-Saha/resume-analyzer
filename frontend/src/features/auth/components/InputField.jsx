import { useState } from 'react';

export default function InputField({
  id, label, type = 'text', icon, value, onChange, error, placeholder, autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isActive = focused || (value && value.length > 0);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-body tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isActive ? 'text-accent' : 'text-muted'}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className={`w-full py-3.5 text-[15px] font-sans text-heading bg-input border-[1.5px] rounded-xl outline-none transition-all duration-200 placeholder:text-muted placeholder:font-normal hover:border-edge-mid hover:bg-white focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_var(--color-accent-ring)] ${icon ? 'pl-11 pr-4' : 'px-4'} ${error ? 'border-error focus:shadow-[0_0_0_3px_rgba(242,116,116,0.15)]' : 'border-edge'} ${isPassword ? 'pr-11' : ''}`}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 bg-transparent border-none text-muted cursor-pointer p-1 flex items-center rounded-lg transition-colors duration-200 hover:text-body"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-error font-medium animate-fade-up" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}