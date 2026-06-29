import { Link } from 'react-router-dom';
import ThemeToggle from '../../../components/ThemeToggle';
import BlurText from '../../../components/react-bits/BlurText';
import ShinyText from '../../../components/react-bits/ShinyText';

export default function AuthLayout({ children, mode }) {
  const isLogin = mode === 'login';

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-surface relative overflow-x-hidden overflow-y-auto p-6 md:p-10" id="auth-layout">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute rounded-full w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-mint/20 dark:bg-mint/10 blur-[120px] -top-[10%] -left-[10%] animate-float-6" aria-hidden="true" />
        <div className="absolute rounded-full w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-peach/20 dark:bg-peach/10 blur-[120px] bottom-[-10%] right-[-5%] animate-float-8" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-[1100px] min-h-[600px] my-auto bg-white/70 dark:bg-card/70 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden border-[1.5px] border-white/40 dark:border-white/10">
        
        <main className="flex-1 flex flex-col items-center justify-center p-12 max-md:p-8 max-md:pt-16 relative bg-transparent" id="auth-form-panel">
          <div className="absolute top-6 left-6 max-md:top-4 max-md:left-4">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-[420px] max-md:max-w-full animate-slide-right">
            <div className="hidden max-md:flex items-center gap-2.5 mb-10">
              <div className="w-9 h-9 bg-accent text-white rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <g>
                    <path d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" fill="#297AFF"/>
                    <g>
                      <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF"/>
                      <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF"/>
                    </g>
                  </g>
                </svg>
              </div>
              <span className="text-[20px] font-sans font-bold text-heading tracking-tight">Athena</span>
            </div>

            <header className="mb-8 text-center md:text-left">
              <h2 className="font-sans text-[32px] max-md:text-[28px] text-heading tracking-tight mb-2 leading-tight flex items-center justify-center md:justify-start gap-2" style={{ fontWeight: 700 }} id="auth-form-title">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-[14px] text-body font-sans">
                {isLogin ? "Today is a new day. It's your day. You shape it." : 'Join us to start analyzing and improving your resumes.'}
              </p>
            </header>

            <div>{children}</div>
          </div>
        </main>

        <aside className="hidden md:flex flex-col flex-none w-[45%] bg-lavender/30 dark:bg-black/20 justify-center items-center p-12 relative overflow-hidden border-l border-white/20 dark:border-white/5" id="auth-brand-panel">
          <div className="absolute rounded-2xl z-[1] w-10 h-10 bg-sky top-[15%] right-[10%] rotate-[15deg] opacity-60 animate-float-7" aria-hidden="true" />
          <div className="absolute rounded-full z-[1] w-6 h-6 bg-peach bottom-[20%] left-[10%] opacity-70 animate-float-8" aria-hidden="true" />

          <div className="relative z-[2] w-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center animate-fade-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-heading text-lavender rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <g>
                      <path d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" fill="#297AFF"/>
                      <g>
                        <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF"/>
                        <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF"/>
                      </g>
                    </g>
                  </svg>
                </div>
                <h1 className="font-sans text-[44px] text-heading tracking-tight leading-none flex" style={{ fontWeight: 800 }}>
                  <BlurText text="Athena" delay={100} animateBy="letters" direction="bottom" />
                </h1>
              </div>
              <p className="text-[13px] font-semibold text-heading/35 tracking-[0.15em] uppercase">
                <ShinyText text="Smart Analyzer" disabled={false} speed={3} className="!text-heading/35" />
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
