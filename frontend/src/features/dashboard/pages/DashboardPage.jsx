import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import BlurText from '../../../components/react-bits/BlurText';
import ShinyText from '../../../components/react-bits/ShinyText';
import SpotlightCard from '../../../components/react-bits/SpotlightCard';
import CountUp from '../../../components/react-bits/CountUp';

import RotatingText from '../../../components/react-bits/RotatingText';


function DashboardIllustration({ scrollY }) {
  const parallaxY = scrollY * -0.15;
  const parallaxScale = Math.max(0.85, 0.9 - scrollY * 0.0005);

  return (
    <div
      className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px] transition-transform duration-75 ease-linear"
      style={{ transform: `translateY(${parallaxY}px)` }}
    >
      <div
        className="relative w-full h-full transform-style-preserve-3d rotate-x-[15deg] rotate-y-[-15deg] rotate-z-[5deg] origin-center animate-float-8 drop-shadow-[0_20px_50px_rgba(124,106,232,0.15)]"
        style={{ transform: `rotateX(15deg) rotateY(-15deg) rotateZ(5deg) scale(${parallaxScale})` }}
      >
        <div className="absolute inset-0 m-auto w-[280px] h-[360px] bg-card rounded-xl border border-edge/80 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-accent/20">
          <div className="p-8 flex flex-col gap-6 h-full">
            <div className="flex items-start gap-4 border-b border-edge/50 pb-4">
              <div className="w-12 h-12 rounded-full bg-edge/50 shrink-0" />
              <div className="flex flex-col gap-2 flex-1 pt-1">
                <div className="h-2 w-3/4 bg-heading/20 rounded-full" />
                <div className="h-1.5 w-1/2 bg-body/20 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-1/3 bg-heading/20 rounded-full" />
                <div className="h-1 w-full bg-edge rounded-full" />
                <div className="h-1 w-5/6 bg-edge rounded-full" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-1/3 bg-heading/20 rounded-full" />
                <div className="h-1 w-full bg-edge rounded-full" />
                <div className="h-1 w-4/5 bg-edge rounded-full" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              <div className="h-4 w-12 rounded bg-mint/30" />
              <div className="h-4 w-16 rounded bg-sky/30" />
              <div className="h-4 w-14 rounded bg-peach/30" />
              <div className="h-4 w-10 rounded bg-lavender/30" />
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-[0_0_15px_rgba(124,106,232,0.8)] animate-scan-beam" />
          <div className="absolute top-0 left-0 right-0 h-20 bg-accent/10 animate-scan-beam pointer-events-none" />
        </div>

        <div className="absolute -right-12 top-16 w-40 bg-card/90 rounded-2xl border border-edge/80 shadow-xl p-3 flex items-center gap-3 animate-float-6 [animation-delay:0.5s] backdrop-blur-xl transform translate-z-[60px] transition-transform duration-500 hover:translate-z-[80px]">
          <div className="w-10 h-10 rounded-xl bg-mint/20 text-mint-deep flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Keywords</span>
            <span className="text-[14px] font-display font-bold text-heading">Matched</span>
          </div>
        </div>

        <div className="absolute -left-16 bottom-20 w-44 bg-card/90 rounded-2xl border border-edge/80 shadow-xl p-3 flex items-center gap-3 animate-float-7 [animation-delay:1s] backdrop-blur-xl transform translate-z-[40px] transition-transform duration-500 hover:translate-z-[60px]">
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-edge)" strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="100" strokeDashoffset="15" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-heading">85%</div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Overall</span>
            <span className="text-[14px] font-display font-bold text-heading">AI Score</span>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/20 rounded-full blur-[80px] -z-10" />
      </div>
    </div>
  );
}

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Drop your PDF — we parse every detail automatically and securely.' },
  { num: '02', title: 'Add Target Role', desc: 'Paste the job description you are aiming for so we can tailor the analysis.' },
  { num: '03', title: 'Get Insights', desc: 'Receive a comprehensive AI match score and action plan in seconds.' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full">
      <section className="relative pt-24 pb-28 max-md:pt-16 max-md:pb-20 overflow-hidden" id="hero-section">
        <div className="w-full mx-auto px-8 lg:px-16 2xl:px-32 max-md:px-5 relative z-10">
          <div className="grid grid-cols-12 gap-12 items-center">

            <div className="col-span-6 max-lg:col-span-12 max-w-[720px] animate-fade-up">
              <h1 className="font-display text-[clamp(3.5rem,6.5vw,5.5rem)] text-heading leading-[0.95] tracking-[-0.02em] mb-6" style={{ fontWeight: 700 }}>
                Unlock your <br />
                <RotatingText
                  texts={['career potential.', 'dream job.', 'next chapter.']}
                  mainClassName="text-accent py-2"
                  staggerDuration={0.02}
                  staggerFrom="last"
                  rotationInterval={3500}
                />
              </h1>

              <p className="text-[clamp(1.05rem,1.8vw,1.25rem)] text-body leading-relaxed max-w-[540px] mb-10">
                Welcome back, <strong>{user?.firstName}</strong>. Upload your resume and a job description to get a match score, interview prep, skill gap analysis, and a personalized action plan.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2.5 px-8 py-4.5 bg-heading text-inverse text-[15px] font-semibold rounded-2xl no-underline hover:bg-heading/90"
                >
                  <span>Start analyzing</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-4.5 text-[15px] font-medium text-heading no-underline rounded-2xl hover:bg-surface">
                  How it works
                </a>
              </div>
            </div>

            <div className="col-span-6 max-lg:col-span-12 max-lg:mt-12">
              <DashboardIllustration scrollY={scrollY} />
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 max-md:py-16 px-8 lg:px-16 2xl:px-32 max-md:px-5 bg-card/30 relative overflow-hidden" id="how-it-works">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

          <div className="w-full lg:w-2/5 animate-fade-up">
            <h2 className="font-display text-[clamp(2.5rem,4vw,3.8rem)] text-heading leading-[1.1] tracking-[-0.02em] mb-5" style={{ fontWeight: 600 }}>
              Three steps to clarity.
            </h2>
            <p className="text-[18px] text-body leading-relaxed mb-10">
              We built our engine to do the heavy lifting, allowing you to focus purely on your preparation.
            </p>
          </div>

          <div className="w-full lg:w-3/5 relative">
            <div className="absolute left-[39px] top-10 bottom-10 w-0.5 z-0 max-md:left-[27px]">
              <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible absolute inset-0">
                <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-edge)" strokeWidth="2" strokeDasharray="8 8" vectorEffect="non-scaling-stroke" />
                <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-accent)" strokeWidth="3" className="animate-line-draw [animation-delay:0.5s]" vectorEffect="non-scaling-stroke" style={{ transformOrigin: 'top' }} />
              </svg>
            </div>

            <div className="flex flex-col gap-16 max-md:gap-12 relative z-10 w-full">
              {steps.map((s, i) => (
                <div key={s.num} className="flex gap-10 max-md:gap-6 items-center animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.2}s` }}>
                  <div className="w-20 h-20 max-md:w-14 max-md:h-14 bg-surface rounded-full shadow-lg flex items-center justify-center shrink-0 relative group overflow-hidden border border-edge">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46%" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="280" strokeDashoffset="280" className="animate-ring-fill" style={{ animationDelay: `${0.6 + i * 0.3}s` }} />
                    </svg>
                    <span className="font-display text-[20px] max-md:text-[16px] font-bold text-heading relative z-10">{s.num}</span>
                  </div>

                  <div className="flex-1 bg-card border border-edge rounded-3xl p-8 max-md:p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-[22px] max-md:text-[18px] font-display font-bold mb-2 text-heading">
                      {s.title}
                    </h3>
                    <p className="text-[15px] max-md:text-[14px] text-body leading-relaxed max-w-[340px]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 max-md:py-20 px-8 lg:px-16 2xl:px-32 max-md:px-5" id="features-section">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-12 gap-4 max-md:grid-cols-1">

              <div className="col-span-7 max-lg:col-span-12 max-md:col-span-1 bg-card rounded-[24px] border border-edge shadow-sm p-6 relative overflow-hidden group hover:shadow-xl transition-shadow duration-500 min-h-[260px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-mint/8 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[11px] font-bold text-muted/60 tracking-[0.2em] uppercase">01</span>
                  <h3 className="text-[20px] max-md:text-[18px] font-display font-bold text-heading mt-1 mb-1.5 leading-snug">Match Score</h3>
                  <p className="text-[13px] text-body leading-[1.6] max-w-[360px] line-clamp-2">
                    Your resume vs. their job post, scored sentence by sentence.
                  </p>
                </div>

                <div className="relative z-10 flex items-end justify-between mt-auto pt-4">
                  <div className="flex items-end gap-1.5 h-[60px]">
                    {[35, 58, 42, 75, 55, 88, 65, 92, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        className="w-2.5 max-md:w-2 rounded-t-md origin-bottom transition-transform duration-500 group-hover:scale-y-110"
                        style={{
                          height: `${h}%`,
                          background: h >= 80 ? 'var(--color-mint-deep)' : h >= 60 ? 'var(--color-edge-mid)' : 'var(--color-edge)',
                          transitionDelay: `${i * 40}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col items-end">
                    <CountUp
                      from={0}
                      to={85}
                      separator=","
                      direction="up"
                      duration={1}
                      className="font-display text-[56px] max-md:text-[40px] font-bold text-heading leading-none tracking-tighter group-hover:text-mint-deep transition-colors duration-500"
                    />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] mt-1">out of 100</span>
                  </div>
                </div>
              </div>

              <div className="col-span-5 max-lg:col-span-12 max-md:col-span-1 bg-card rounded-[24px] border border-edge shadow-sm p-6 relative overflow-hidden group hover:shadow-xl transition-shadow duration-500 min-h-[260px] flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-sky/8 rounded-full blur-[50px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[11px] font-bold text-muted/60 tracking-[0.2em] uppercase">02</span>
                  <h3 className="text-[20px] max-md:text-[18px] font-display font-bold text-heading mt-1 mb-1.5 leading-snug">Interview Prep</h3>
                  <p className="text-[13px] text-body leading-[1.6] max-w-[340px] line-clamp-2">
                    Questions they'll probably ask, and how to answer.
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-4 flex flex-col gap-1.5">
                  <div className="bg-surface border border-edge rounded-xl px-3 py-2 flex items-center gap-2 group-hover:-translate-y-1 transition-transform duration-400">
                    <div className="w-5 h-5 rounded-md bg-sky/30 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-sky-deep">T</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-1 w-4/5 bg-edge-mid rounded-full" />
                    </div>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                  <div className="bg-surface border border-edge rounded-xl px-3 py-2 flex items-center gap-2 group-hover:-translate-y-0.5 transition-transform duration-400 delay-75">
                    <div className="w-5 h-5 rounded-md bg-lavender/50 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-lavender-deep">B</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-1 w-3/5 bg-edge-mid rounded-full" />
                    </div>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-5 max-lg:col-span-12 max-md:col-span-1 bg-card rounded-[24px] border border-edge shadow-sm p-6 relative overflow-hidden group hover:shadow-xl transition-shadow duration-500 min-h-[220px] flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-[120px] h-[120px] bg-peach/10 rounded-full blur-[40px] -translate-y-1/4 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[11px] font-bold text-muted/60 tracking-[0.2em] uppercase">03</span>
                  <h3 className="text-[20px] max-md:text-[18px] font-display font-bold text-heading mt-1 mb-1.5 leading-snug">Skill Gaps</h3>
                  <p className="text-[13px] text-body leading-[1.6] max-w-[340px] line-clamp-2">
                    The specific keywords missing from your resume.
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-4 flex flex-col gap-2.5">
                  {[
                    { label: 'Docker', pct: 95, color: 'bg-error', textColor: 'text-error' },
                    { label: 'AWS', pct: 72, color: 'bg-warning', textColor: 'text-warning' },
                    { label: 'CI/CD', pct: 45, color: 'bg-mint-deep', textColor: 'text-mint-deep' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${item.textColor} w-[40px] text-right shrink-0`}>{item.label}</span>
                      <div className="flex-1 h-1 bg-edge rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} origin-left animate-bar-grow`}
                          style={{ width: `${item.pct}%`, animationDelay: `${0.8 + i * 0.15}s` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted w-[24px]">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-7 max-lg:col-span-12 max-md:col-span-1 bg-heading rounded-[24px] shadow-xl p-6 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500 min-h-[220px] flex flex-col justify-between">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                <div className="relative z-10">
                  <span className="text-[11px] font-bold text-inverse/30 tracking-[0.2em] uppercase">04</span>
                  <h3 className="text-[20px] max-md:text-[18px] font-display font-bold text-inverse mt-1 mb-1.5 leading-snug">Day-by-Day Roadmap</h3>
                  <p className="text-[13px] text-inverse/60 leading-[1.6] max-w-[420px] line-clamp-2">
                    A tailored, week-long plan to bridge your skill gaps and ace the interview.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-2.5 mt-auto pt-4">
                  <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-inverse/10 border border-inverse/20 flex items-center justify-center shrink-0 text-[9px] font-bold text-inverse/70 group-hover:bg-mint/20 group-hover:text-mint group-hover:border-mint/30 transition-all duration-300">D1</div>
                    <div className="flex-1 h-px bg-inverse/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-full bg-mint -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    </div>
                    <span className="text-[11px] text-inverse/70 font-medium">Core Concepts</span>
                  </div>
                  <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    <div className="w-6 h-6 rounded-full bg-inverse/10 border border-inverse/20 flex items-center justify-center shrink-0 text-[9px] font-bold text-inverse/70 group-hover:bg-sky/20 group-hover:text-sky group-hover:border-sky/30 transition-all duration-300">D3</div>
                    <div className="flex-1 h-px bg-inverse/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-full bg-sky -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out delay-75" />
                    </div>
                    <span className="text-[11px] text-inverse/70 font-medium">Mock Interviews</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2 animate-fade-up lg:pl-12">
            <p className="text-[13px] font-bold text-accent uppercase tracking-[0.15em] mb-4">What you actually get</p>
            <h2 className="font-display text-[clamp(2.5rem,4vw,3.8rem)] text-heading leading-[1.05] tracking-[-0.03em] mb-5" style={{ fontWeight: 700 }}>
              Not another vague<br />score. Real answers.
            </h2>
            <p className="text-[17px] text-body leading-[1.7]">
              Every analysis breaks down into four concrete deliverables. No fluff, no "leverage your synergies" — just the stuff that actually helps you land the job.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
