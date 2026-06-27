import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../services/profile.api';
import { deleteReport } from '../../resume/services/resume.api';
import { useAuth } from '../../auth/hooks/useAuth';
import Loader from '../../../components/Loader';
import { useToast } from '../../../components/ToastContext';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { user, handleLogout } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [addToast]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleteConfirmId === id) {
      try {
        await deleteReport(id);
        setProfile(prev => ({
          ...prev,
          reports: prev.reports.filter(r => r._id !== id)
        }));
        addToast({ type: 'success', message: 'Report deleted.' });
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete report.' });
      }
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => {
        setDeleteConfirmId(current => current === id ? null : current);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="h-[calc(100vh-72px)]"><Loader fullScreen={false} text="Loading..." /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-8">
        <p className="text-muted">Could not load profile.</p>
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const initials = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .map(n => n.charAt(0).toUpperCase())
    .join('');
  const memberSince = profile.reports?.length
    ? new Date(profile.reports[profile.reports.length - 1]?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const sortedReports = [...(profile.reports || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const avgScore = sortedReports.length
    ? Math.round(sortedReports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / sortedReports.length)
    : null;

  return (
    <div className="w-full">

      <section className="relative overflow-hidden border-b border-edge/60">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-heading) 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="w-full max-w-[1100px] mx-auto px-8 lg:px-16 max-md:px-5 pt-16 pb-14 max-md:pt-12 max-md:pb-10">
          <div className="flex items-start gap-7 max-md:flex-col max-md:items-center max-md:text-center">
            <div className="w-[88px] h-[88px] rounded-2xl bg-heading text-surface flex items-center justify-center text-[34px] font-display font-bold shadow-lg shrink-0">
              {initials || 'U'}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display text-[28px] font-bold text-heading leading-tight tracking-[-0.01em]">
                {fullName}
              </h1>
              <p className="text-[15px] text-muted mt-1.5">{profile.email}</p>
              <div className="flex items-center gap-5 mt-4 max-md:justify-center">
                <span className="text-[12px] font-semibold text-body/60">Member since {memberSince}</span>
                <span className="w-1 h-1 rounded-full bg-edge" />
                <span className="text-[12px] font-semibold text-body/60">{sortedReports.length} {sortedReports.length === 1 ? 'analysis' : 'analyses'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1100px] mx-auto px-8 lg:px-16 max-md:px-5 py-12">

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[22px] font-bold text-heading">Past Analyses</h2>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-heading text-inverse text-[13px] font-semibold rounded-xl no-underline transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            New Analysis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </Link>
        </div>

        {sortedReports.length === 0 ? (
          <div className="border border-dashed border-edge rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <p className="text-[16px] font-semibold text-heading mb-1">Nothing here yet</p>
            <p className="text-[14px] text-muted mb-6 max-w-[280px]">Run your first resume analysis and it will show up here.</p>
            <Link to="/analyze" className="text-[13px] font-semibold text-accent no-underline hover:underline">
              Go to Analyze →
            </Link>
          </div>
        ) : (
          /* Table-style list */
          <div className="border border-edge rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_140px_100px_60px] gap-4 px-6 py-3 bg-card/50 border-b border-edge text-[11px] font-bold text-muted uppercase tracking-[0.12em]">
              <span>Job Description</span>
              <span>Date</span>
              <span className="text-right">Score</span>
              <span></span>
            </div>

            {sortedReports.map((report, idx) => {
              const dateStr = new Date(report.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              const score = report.matchScore;
              const scoreColor = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-error';
              const jdPreview = report.jobDescription
                ? report.jobDescription.length > 80
                  ? report.jobDescription.slice(0, 80) + '…'
                  : report.jobDescription
                : 'No description';

              return (
                <Link
                  key={report._id || idx}
                  to={`/report/${report._id}`}
                  className={`group relative grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_60px] gap-2 sm:gap-4 items-center px-6 py-4 no-underline transition-colors duration-150 hover:bg-card/60 ${
                    idx < sortedReports.length - 1 ? 'border-b border-edge/50' : ''
                  }`}
                >
                  <span className="text-[14px] font-medium text-heading group-hover:text-accent transition-colors line-clamp-1 pr-12 sm:pr-0">
                    {jdPreview}
                  </span>

                  <span className="text-[13px] text-muted font-medium">{dateStr}</span>

                  <span className={`text-[20px] font-display font-bold ${scoreColor} sm:text-right tabular-nums`}>
                    {score ?? '—'}
                  </span>
                  
                  <div className="flex justify-end absolute sm:relative right-4 sm:right-0 top-4 sm:top-auto">
                    <button 
                      onClick={(e) => handleDelete(e, report._id)}
                      className={`h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        deleteConfirmId === report._id 
                          ? 'bg-error text-inverse font-bold text-[11px] px-2 w-[60px]' 
                          : 'text-muted hover:text-error hover:bg-error/10 w-8'
                      }`}
                      title={deleteConfirmId === report._id ? "Confirm Delete" : "Delete Report"}
                    >
                      {deleteConfirmId === report._id ? (
                        "Sure?"
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
