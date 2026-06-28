import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchReportById, exportReportPDF } from '../services/resume.api';
import Loader from '../../../components/Loader';
import { useToast } from '../../../components/ToastContext';
import CountUp from '../../../components/react-bits/CountUp';

/* ─── Clean Severity Config ─── */
const severityMap = {
  high: { text: 'text-error', border: 'border-error/20', bar: 'bg-error', label: 'High Priority', width: '100%' },
  moderate: { text: 'text-warning', border: 'border-warning/30', bar: 'bg-warning', label: 'Moderate', width: '60%' },
  low: { text: 'text-success', border: 'border-success/30', bar: 'bg-success', label: 'Low', width: '30%' },
};

/* ─── Premium Question Card ─── */
function QuestionCard({ question, intention, answer, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-surface rounded-2xl border transition-colors ${open ? 'border-accent/40 shadow-sm' : 'border-edge hover:border-accent/30'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-transparent border-none cursor-pointer text-left group"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center font-bold text-[14px] shrink-0 mt-0.5 transition-colors ${open ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-card border-edge text-muted group-hover:border-accent/50 group-hover:text-accent'}`}>
            {index}
          </div>
          <h4 className={`text-[15px] sm:text-[17px] font-bold leading-snug transition-colors ${open ? 'text-accent' : 'text-heading group-hover:text-accent'}`}>
            {question}
          </h4>
        </div>
        <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'bg-accent/10 border-accent/20 text-accent rotate-180' : 'bg-surface border-edge text-muted group-hover:text-accent rotate-0'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className="grid transition-all duration-300 w-full" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
            <div className="bg-card rounded-xl p-4 border border-edge/50">
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.1em] mb-2">The Hidden Intention</p>
              <p className="text-[14px] text-body leading-relaxed">{intention}</p>
            </div>
            
            <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
              <p className="text-[11px] font-bold text-accent uppercase tracking-[0.1em] mb-2">Recommended Strategy</p>
              <p className="text-[14px] text-heading font-medium leading-relaxed">{answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Clean Score Ring ─── */
function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 75 ? 'var(--color-success)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <div className="relative w-[110px] h-[110px] flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-edge)" strokeWidth="5" />
        <circle
          cx="50" cy="50" r="46" fill="none"
          stroke={scoreColor} strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out delay-300"
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <CountUp
          from={0}
          to={score}
          direction="up"
          duration={1}
          className="font-display text-[32px] font-bold text-heading leading-none tracking-tight"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!!id && !location.state?.report);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (id && !location.state?.report) {
      const getReport = async () => {
        try {
          const data = await fetchReportById(id);
          setReport(data);
        } catch (err) {
          addToast({ type: 'error', message: 'Failed to fetch report details.' });
        } finally {
          setLoading(false);
        }
      };
      getReport();
    }
  }, [id, location.state?.report, addToast]);

  if (loading) {
    return <Loader fullScreen={true} text="Loading report..." />;
  }

  if (!report) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-8">
        <div className="text-center max-w-[420px]">
          <h2 className="font-display text-[24px] font-bold text-heading mb-2">No report found</h2>
          <p className="text-[15px] text-body mb-6">You need to analyze a resume first to see results here.</p>
          <Link to="/analyze" className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-inverse font-semibold rounded-xl no-underline hover:bg-heading/90">
            Analyze a resume
          </Link>
        </div>
      </div>
    );
  }

  const { matchScore, skillGaps, technicalQuestions, behavioralQuestions, preparationPlan } = report;

  const handleCopyReport = () => {
    const text = [
      `Match Score: ${matchScore}/100\n`,
      '── Skill Gaps ──',
      ...(skillGaps?.map(g => `• ${g.skill} (${g.severity})`) || ['None identified']),
      '\n── Technical Questions ──',
      ...(technicalQuestions?.map((q, i) => `${i + 1}. ${q.questions}\n   Intention: ${q.intention}\n   Answer: ${q.answer}`) || []),
      '\n── Behavioral Questions ──',
      ...(behavioralQuestions?.map((q, i) => `${i + 1}. ${q.questions}\n   Intention: ${q.intention}\n   Answer: ${q.answer}`) || []),
      '\n── Preparation Plan ──',
      ...(preparationPlan?.map(d => `Day ${d.day}: ${d.focus}\n${d.tasks?.map(t => `  • ${t}`).join('\n')}`) || []),
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      addToast({ type: 'success', message: 'Report copied to clipboard.' });
    });
  };

  const handleExport = async () => {
    if (!report?._id && !id) return;
    try {
      setIsExporting(true);
      await exportReportPDF(report?._id || id);
      addToast({ type: 'success', message: 'PDF downloaded successfully.' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate PDF.' });
    } finally {
      setIsExporting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-surface text-body font-sans selection:bg-accent selection:text-inverse">
      
      <div className="flex flex-1 max-lg:flex-col relative items-start">
        
        <aside className="w-[320px] shrink-0 border-r border-edge bg-card overflow-y-auto max-lg:w-full max-lg:border-r-0 max-lg:border-b z-30 lg:fixed lg:top-[120px] lg:bottom-0 lg:left-0 max-lg:h-auto">
          <div className="p-6 flex flex-col">
            
            <div className="flex flex-col items-center text-center animate-fade-up">
              <h1 className="font-display text-[20px] font-bold text-heading mb-0.5">Analysis Report</h1>
              <p className="text-[12px] text-muted mb-5">Generated by Resume AI</p>
              
              <ScoreRing score={matchScore} />
              
              <p className="text-[13px] text-body mt-5 leading-relaxed max-w-[260px]">
                Your resume meets <strong className="text-heading">{matchScore}%</strong> of the target job requirements based on keyword and semantic analysis.
              </p>

              <div className="flex flex-col gap-2 mt-5 w-full max-w-[260px]">
                <div className="flex gap-2">
                  <button onClick={handleCopyReport} className="flex-1 py-2 rounded-xl border border-edge bg-surface text-[12px] font-semibold text-heading hover:bg-edge/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    Copy
                  </button>
                  <button onClick={handleExport} disabled={isExporting} className="flex-1 py-2 rounded-xl bg-heading text-inverse text-[12px] font-semibold hover:bg-heading/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {isExporting ? (
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                    )}
                    {isExporting ? 'Printing...' : 'Print'}
                  </button>
                </div>
                <button onClick={() => navigate('/')} className="w-full mt-1 py-1.5 text-[12px] font-semibold text-muted hover:text-heading transition-colors bg-transparent border-none flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:0.1s] mt-6 pt-5 border-t border-edge/50">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 px-1">Overview</h3>
              <div className="flex flex-col gap-1">
                <button onClick={() => scrollToSection('skill-gaps')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-surface cursor-pointer border-none bg-transparent group transition-colors">
                  <span className="text-[13px] text-heading font-medium group-hover:text-accent">Skill Gaps</span>
                  <span className="text-[12px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-md">{skillGaps?.length || 0}</span>
                </button>
                <button onClick={() => scrollToSection('interview-prep')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-surface cursor-pointer border-none bg-transparent group transition-colors">
                  <span className="text-[13px] text-heading font-medium group-hover:text-accent">Questions</span>
                  <span className="text-[12px] font-bold text-sky-deep bg-sky/10 px-2 py-0.5 rounded-md">{(technicalQuestions?.length || 0) + (behavioralQuestions?.length || 0)}</span>
                </button>
                <button onClick={() => scrollToSection('prep-plan')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-surface cursor-pointer border-none bg-transparent group transition-colors">
                  <span className="text-[13px] text-heading font-medium group-hover:text-accent">Prep Days</span>
                  <span className="text-[12px] font-bold text-lavender-deep bg-lavender/10 px-2 py-0.5 rounded-md">{preparationPlan?.length || 0}</span>
                </button>
              </div>
            </div>

          </div>
        </aside>

        <main className="flex-1 lg:ml-[320px]">
          <div className="max-w-[900px] mx-auto px-16 py-16 max-xl:px-10 max-md:px-6 max-md:py-10 flex flex-col gap-20">
            
            <section id="skill-gaps" className="animate-fade-up [animation-delay:0.1s] scroll-mt-8">
              <div className="mb-8">
                <h2 className="font-display text-[28px] font-bold text-heading tracking-tight">Identified Skill Gaps</h2>
                <p className="text-[15px] text-muted mt-2">Keywords and concepts missing from your resume.</p>
              </div>
              
              <div className="bg-card border border-edge rounded-2xl shadow-sm">
                {skillGaps?.length > 0 ? (
                  <div className="flex flex-col">
                    {skillGaps.map((gap, i) => {
                      const sev = severityMap[gap.severity] || severityMap.low;
                      return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 sm:p-6 border-b border-edge last:border-b-0 hover:bg-surface/50 transition-colors">
                          <div className="w-[120px] shrink-0">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${sev.text}`}>
                              {sev.label}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-[16px] font-semibold text-heading mb-2">{gap.skill}</p>
                            <div className="w-full h-1.5 bg-edge rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${sev.bar}`} style={{ width: sev.width }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[15px] text-muted">No skill gaps identified. Your resume covers all critical requirements.</div>
                )}
              </div>
            </section>

            <section id="interview-prep" className="animate-fade-up [animation-delay:0.2s] scroll-mt-8">
              <div className="mb-8">
                <h2 className="font-display text-[28px] font-bold text-heading tracking-tight">Interview Preparation</h2>
                <p className="text-[15px] text-muted mt-2">AI-generated questions based on your profile and the role.</p>
              </div>

              <div className="flex flex-col gap-12">
                <div>
                  <h3 className="text-[13px] font-bold text-heading uppercase tracking-widest mb-5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-sky-deep" />
                    Technical Questions
                  </h3>
                  <div className="flex flex-col gap-4">
                    {technicalQuestions?.length > 0 ? (
                      technicalQuestions.map((q, i) => (
                        <QuestionCard key={i} index={i + 1} question={q.questions} intention={q.intention} answer={q.answer} />
                      ))
                    ) : (
                      <div className="py-8 text-center text-[15px] text-muted bg-card border border-edge rounded-2xl shadow-sm">No technical questions generated.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-heading uppercase tracking-widest mb-5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-lavender-deep" />
                    Behavioral Questions
                  </h3>
                  <div className="flex flex-col gap-4">
                    {behavioralQuestions?.length > 0 ? (
                      behavioralQuestions.map((q, i) => (
                        <QuestionCard key={i} index={i + 1} question={q.questions} intention={q.intention} answer={q.answer} />
                      ))
                    ) : (
                      <div className="py-8 text-center text-[15px] text-muted bg-card border border-edge rounded-2xl shadow-sm">No behavioral questions generated.</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="prep-plan" className="animate-fade-up [animation-delay:0.3s] scroll-mt-8 pb-12">
              <div className="mb-8">
                <h2 className="font-display text-[28px] font-bold text-heading tracking-tight">Preparation Roadmap</h2>
                <p className="text-[15px] text-muted mt-2">A day-by-day plan to close your gaps before the interview.</p>
              </div>

              <div className="relative border-l-2 border-edge/50 ml-4 space-y-8 pb-4">
                {preparationPlan?.length > 0 ? (
                  preparationPlan.map((day, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-surface border-2 border-accent text-accent flex items-center justify-center text-[12px] font-bold shadow-sm z-10">
                        {day.day}
                      </div>
                      
                      <div className="bg-card border border-edge rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-[16px] sm:text-[18px] font-bold text-heading mb-4 leading-snug">{day.focus}</h4>
                        <ul className="flex flex-col gap-3 list-none m-0 p-0">
                          {day.tasks?.map((task, j) => (
                            <li key={j} className="text-[14px] text-body flex items-start gap-3 bg-surface/50 p-3 rounded-xl border border-edge/50">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                              <span className="leading-relaxed">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pl-8 text-[15px] text-muted">No preparation plan generated.</div>
                )}
              </div>
            </section>

          </div>
        </main>

      </div>
    </div>
  );
}
