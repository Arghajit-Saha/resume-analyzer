export default function SubmitButton({ children, loading, ...props }) {
  return (
    <button
      className="w-full py-3.5 px-6 text-[15px] font-semibold font-sans text-inverse bg-accent border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 relative overflow-hidden hover:not-disabled:bg-accent-hover hover:not-disabled:scale-[1.01] hover:not-disabled:shadow-[0_4px_16px_rgba(45,43,61,0.08)] active:not-disabled:scale-[0.98] active:not-disabled:shadow-[0_1px_2px_rgba(45,43,61,0.04)] disabled:opacity-70 disabled:cursor-not-allowed group"
      disabled={loading}
      {...props}
      type="submit"
    >
      {loading ? (
        <span className="flex gap-1.5 items-center">
          <span className="w-[7px] h-[7px] rounded-full bg-inverse animate-dot-pulse" />
          <span className="w-[7px] h-[7px] rounded-full bg-inverse animate-dot-pulse [animation-delay:0.15s]" />
          <span className="w-[7px] h-[7px] rounded-full bg-inverse animate-dot-pulse [animation-delay:0.3s]" />
        </span>
      ) : (
        <>
          <span>{children}</span>
          <svg className="transition-transform duration-200 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </>
      )}
    </button>
  );
}
