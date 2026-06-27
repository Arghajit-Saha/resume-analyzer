import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { useToast } from './ToastContext';

export default function AppLayout() {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/analyze', label: 'Analyze' },
  ];

  const onLogout = async () => {
    await handleLogout();
    addToast({ type: 'success', message: 'Signed out successfully.' });
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col font-sans text-body relative selection:bg-accent selection:text-inverse">

      <div className="fixed top-6 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 animate-fade-in">
        <nav className="pointer-events-auto w-full max-w-[720px] bg-white/60 dark:bg-card/60 backdrop-blur-2xl border border-lavender/30 dark:border-lavender/10 shadow-2xl shadow-accent/5 rounded-full p-2 flex items-center justify-between transition-all hover:border-lavender/50">

          <div className="flex-1 flex justify-start pl-1">
            <Link to="/" className="flex items-center gap-2.5 rounded-full no-underline" title="Home">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-heading text-surface shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 40 40" fill="none">
                  <g>
                    <path d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" fill="#297AFF"/>
                    <g>
                      <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF"/>
                      <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF"/>
                    </g>
                  </g>
                </svg>
              </div>
              <span className="font-sans font-bold tracking-tight text-[17px] text-heading pr-2">Athena</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 px-6 sm:px-10 border-x border-edge/40">
            {navItems.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-300 no-underline ${isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20'
                      : 'text-muted hover:text-accent hover:bg-lavender/20'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex-1 flex items-center justify-end gap-2 pr-1">
            <ThemeToggle className="!w-10 !h-10 rounded-full bg-transparent border-none opacity-60 hover:opacity-100 hover:bg-edge/30 transition-all flex items-center justify-center" />

            <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-inverse shadow-md hover:scale-105 transition-transform no-underline" title="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            <button
              onClick={onLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent border border-transparent text-muted hover:text-error hover:bg-error/10 transition-all cursor-pointer"
              title="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>

        </nav>
      </div>

      <div className="h-[120px]" />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className={`mt-10 py-10 px-8 lg:px-16 2xl:px-32 max-md:px-5 border-t border-lavender/20 bg-lavender/5 dark:bg-card/30 backdrop-blur-sm relative overflow-hidden ${location.pathname.startsWith('/report') ? 'lg:ml-[320px]' : ''}`}>
        <div className="absolute rounded-full w-[40vw] h-[40vw] bg-mint/10 dark:bg-mint/5 blur-[80px] -bottom-[20%] -left-[10%] pointer-events-none" aria-hidden="true" />
        <div className="absolute rounded-full w-[30vw] h-[30vw] bg-peach/10 dark:bg-peach/5 blur-[80px] -bottom-[10%] right-[5%] pointer-events-none" aria-hidden="true" />

        <div className="w-full mx-auto flex items-center justify-between max-md:flex-col max-md:gap-6 relative z-10">
          
          <div className="flex flex-col gap-1.5 max-md:items-center">
             <div className="flex items-center gap-2 opacity-90">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 40 40" fill="none">
                 <g>
                   <path d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" fill="#297AFF"/>
                   <g>
                     <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF"/>
                     <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF"/>
                   </g>
                 </g>
               </svg>
               <span className="font-sans font-bold tracking-tight text-[15px] text-heading">Athena</span>
             </div>
             <span className="text-[13px] text-muted font-medium flex items-center gap-1.5">
               Made with <span className="text-error">❤️</span> by 
               <a 
                 href="https://github.com/Arghajit-Saha" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-heading font-semibold hover:text-accent transition-colors no-underline decoration-accent/30 underline-offset-4 hover:underline"
               >
                 Arghajit Saha
               </a>
             </span>
          </div>

          <div className="flex items-center gap-6 text-[13px] text-muted font-medium">
             <a href="#" className="no-underline hover:text-heading hover:underline underline-offset-4 decoration-edge-mid transition-all">Contact</a>
             <a href="#" className="no-underline hover:text-heading hover:underline underline-offset-4 decoration-edge-mid transition-all">Feedback</a>
          </div>

        </div>
      </footer>
    </div>
  );
}
