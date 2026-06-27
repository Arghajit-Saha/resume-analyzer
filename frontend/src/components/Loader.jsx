import React from 'react';

export default function Loader({ text = "Loading...", fullScreen = false, small = false }) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface gap-6 animate-fade-in"
    : `flex flex-col items-center justify-center w-full gap-4 animate-fade-in ${small ? 'py-4' : 'min-h-[200px]'}`;

  const sizeClass = small ? "w-6 h-6" : "w-10 h-10";

  return (
    <div className={containerClass}>
      <svg 
        className={`${sizeClass} animate-spin text-accent`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {text && (
        <p className={`font-medium text-muted animate-pulse ${small ? 'text-[13px]' : 'text-[15px]'}`}>
          {text}
        </p>
      )}
    </div>
  );
}
