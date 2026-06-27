import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/resume.api';
import { useToast } from '../../../components/ToastContext';
import Stepper, { Step } from '../../../components/react-bits/Stepper';
import Loader from '../../../components/Loader';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const phases = ['Parsing your resume...', 'Cross-referencing with job description...', 'Building your report...'];

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingPhase((p) => (p + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      addToast({ type: 'warning', message: 'Please upload a PDF file.' });
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
    } else if (selected) {
      addToast({ type: 'warning', message: 'Please upload a PDF file.' });
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFinalStep = async () => {
    if (!file) { addToast({ type: 'warning', message: 'Please upload your resume first.' }); return; }
    if (!jobDescription.trim()) { addToast({ type: 'warning', message: 'Please provide a job description.' }); return; }

    setLoading(true);
    setLoadingPhase(0);
    try {
      const data = await analyzeResume({
        resumeFile: file,
        selfDescription,
        jobDescription,
      });
      addToast({ type: 'success', message: 'Analysis complete! Viewing your report.' });
      navigate(`/report/${data.resumeReport._id}`, { state: { report: data.resumeReport } });
    } catch {
      addToast({ type: 'error', message: 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = 
    (currentStep === 1 && !file) ||
    (currentStep === 2 && !jobDescription.trim()) ||
    loading;

  return (
    <div className="w-full flex-1 flex flex-col items-center pt-12 pb-24 max-md:pt-8 max-md:pb-16 px-8 lg:px-16 2xl:px-32 max-md:px-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-accent/4 top-[-250px] left-1/2 -translate-x-1/2 blur-[150px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-mint/5 bottom-[-100px] right-[-100px] blur-[120px]" />
      </div>

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/60 backdrop-blur-md animate-fade-in">
          <Loader text={phases[loadingPhase]} />
        </div>
      )}

      <div className="w-full max-w-[1100px] relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 mt-4 lg:mt-12">

        <div className="mb-4 lg:mb-0 text-center lg:text-left animate-fade-up flex-1 lg:pt-16">
          <p className="text-[13px] font-bold text-accent uppercase tracking-[0.15em] mb-3">Analysis workspace</p>
          <h1 className="font-display text-[clamp(2.5rem,4vw,4rem)] text-heading leading-[1.05] tracking-[-0.03em] mb-5" style={{ fontWeight: 700 }}>
            Drop your resume.<br />We'll do the rest.
          </h1>
          <p className="text-[16px] text-body leading-relaxed max-w-[440px] mx-auto lg:mx-0">
            Three steps — upload, describe, and launch your analysis.
          </p>
        </div>

        <div className="w-full lg:w-[560px] shrink-0">
          <Stepper
          initialStep={1}
          onStepChange={setCurrentStep}
          onFinalStepCompleted={handleFinalStep}
          backButtonText="Back"
          nextButtonText="Continue"
          nextButtonProps={{
            disabled: isNextDisabled,
            style: isNextDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {},
          }}
        >
          <Step>
            <div className="flex flex-col gap-5 py-2">
              <div className="mb-1">
                <h2 className="font-display text-[20px] font-bold text-heading mb-1">Upload your resume</h2>
                <p className="text-[14px] text-muted">We accept PDF files up to 10 MB.</p>
              </div>

              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-2xl p-12 max-md:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 group min-h-[260px] overflow-hidden ${
                    dragActive
                      ? 'bg-accent/8 border-2 border-accent scale-[1.01] shadow-xl shadow-accent/10'
                      : 'bg-surface border-2 border-dashed border-edge hover:border-accent/40 hover:shadow-lg'
                  }`}
                  id="drop-zone"
                >
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="file-input" />




                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                      dragActive ? 'bg-accent/15 shadow-lg shadow-accent/20' : 'bg-card border border-edge shadow-md'
                    }`}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-[17px] font-display font-bold text-heading mb-1.5 transition-colors group-hover:text-accent">
                      {dragActive ? 'Drop it right here' : 'Choose a PDF'}
                    </p>
                    <p className="text-[13px] text-muted">or drag and drop your resume</p>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-surface border border-edge p-5 flex items-center gap-5 animate-fade-up overflow-hidden group" id="file-preview">
                  <div className="w-14 h-[4.5rem] bg-card border border-edge rounded-xl shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-edge" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-heading truncate mb-0.5">{file.name}</p>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] text-muted">{formatSize(file.size)}</span>
                      <span className="w-1 h-1 rounded-full bg-edge-mid" />
                      <span className="text-[12px] font-bold text-mint-deep flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Ready
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="w-9 h-9 rounded-lg bg-card border border-edge flex items-center justify-center text-muted cursor-pointer transition-all hover:bg-error/10 hover:border-error/20 hover:text-error shrink-0"
                    title="Remove file"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              )}
            </div>
          </Step>

          <Step>
            <div className="flex flex-col gap-5 py-2">
              <div className="mb-1">
                <h2 className="font-display text-[20px] font-bold text-heading mb-1">Describe the target role</h2>
                <p className="text-[14px] text-muted">Paste the job posting so we can tailor the analysis to it.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="job-description" className="text-[13px] font-semibold text-heading flex items-center gap-2">
                    Job Description
                    <span className="text-[10px] font-bold text-error uppercase tracking-wider bg-error/10 px-1.5 py-0.5 rounded">Required</span>
                  </label>
                  <span className="text-[11px] font-bold text-muted tabular-nums">{jobDescription.length}/5000</span>
                </div>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value.slice(0, 5000))}
                  placeholder="Paste the full job posting — title, requirements, responsibilities, the works..."
                  className="w-full py-4 px-5 text-[14px] font-sans text-heading bg-input border border-edge rounded-2xl outline-none resize-none h-[220px] transition-all duration-200 placeholder:text-muted hover:border-edge-mid focus:border-accent focus:bg-surface focus:shadow-[0_0_0_3px_var(--color-accent-ring)]"
                />
              </div>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col gap-5 py-2">
              <div className="mb-1">
                <h2 className="font-display text-[20px] font-bold text-heading mb-1">Anything else?</h2>
                <p className="text-[14px] text-muted">Optional — add context the AI should consider.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="self-description" className="text-[13px] font-semibold text-heading flex items-center gap-2">
                    Additional Context
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider bg-surface px-1.5 py-0.5 rounded">Optional</span>
                  </label>
                  <span className="text-[11px] font-bold text-muted tabular-nums">{selfDescription.length}/2000</span>
                </div>
                <textarea
                  id="self-description"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value.slice(0, 2000))}
                  placeholder="Career gaps, switching industries, specific goals — anything the AI should factor in."
                  className="w-full py-4 px-5 text-[14px] font-sans text-heading bg-input border border-edge rounded-2xl outline-none resize-none h-[140px] transition-all duration-200 placeholder:text-muted hover:border-edge-mid focus:border-accent focus:bg-surface focus:shadow-[0_0_0_3px_var(--color-accent-ring)]"
                />
              </div>

              <div className="bg-surface border border-edge rounded-2xl p-5 flex flex-col gap-3 mt-2">
                <p className="text-[12px] font-bold text-muted uppercase tracking-wider">Analysis summary</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${file ? 'bg-mint-deep' : 'bg-edge-mid'}`} />
                    <span className="text-[13px] text-heading font-medium truncate max-w-[180px]">{file ? file.name : 'No file'}</span>
                  </div>
                  <span className="w-px h-4 bg-edge" />
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${jobDescription.trim() ? 'bg-mint-deep' : 'bg-edge-mid'}`} />
                    <span className="text-[13px] text-heading font-medium">{jobDescription.trim() ? `${jobDescription.trim().split(/\s+/).length} words` : 'No JD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Step>
        </Stepper>
        </div>
      </div>
    </div>
  );
}
