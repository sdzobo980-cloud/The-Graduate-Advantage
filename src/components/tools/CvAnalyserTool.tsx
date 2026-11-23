import {
  AlertCircle,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_GRADUATE_CV } from '../../data/sampleData.ts';
import { requestCvAnalysis } from '../../services/careerApi.ts';
import type { CvAnalysisResult } from '../../types/career.ts';
import { CopyButton } from '../CopyButton.tsx';

function formatAnalysisForCopy(result: CvAnalysisResult): string {
  const formatList = (items: string[]) =>
    items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : '- None noted';

  return [
    'THE GRADUATE ADVANTAGE — CV ANALYSIS REPORT',
    '',
    '1. OVERALL CV ASSESSMENT',
    result.overallAssessment,
    '',
    '2. PROFESSIONAL PRESENTATION & STRUCTURE',
    result.presentationAndStructure,
    '',
    '3. SKILLS IDENTIFIED',
    formatList(result.skillsIdentified),
    '',
    '4. EDUCATION & QUALIFICATIONS IDENTIFIED',
    formatList(result.educationAndQualifications),
    '',
    '5. PROJECTS & EXPERIENCE IDENTIFIED',
    formatList(result.projectsAndExperience),
    '',
    '6. STRENGTHS OF THE CV',
    formatList(result.strengths),
    '',
    '7. AREAS THAT COULD BE IMPROVED',
    formatList(result.areasToImprove),
    '',
    '8. MISSING OR UNCLEAR INFORMATION',
    formatList(result.missingOrUnclearInformation),
  ].join('\n');
}

export function CvAnalyserTool() {
  const [cvText, setCvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CvAnalysisResult | null>(null);

  async function handleAnalyse() {
    setError(null);
    const trimmed = cvText.trim();
    if (!trimmed) {
      setError('Please paste your CV or resume text before clicking Analyse My CV.');
      return;
    }
    if (trimmed.length < 30) {
      setError('Please enter a fuller CV excerpt (at least 30 characters) for an accurate analysis.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestCvAnalysis(trimmed);
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to analyse your CV right now.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCvText('');
    setResult(null);
    setError(null);
  }

  function handleLoadSample() {
    setCvText(SAMPLE_GRADUATE_CV);
    setError(null);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B89450]">
              <span className="font-mono tabular-nums">01.</span>
              <span>CV Analyser</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#14253D]">
              Evaluate your CV structure and readiness
            </h1>
            <p className="text-sm text-[#14253D]/75 max-w-2xl leading-relaxed">
              Paste your CV or resume text below. Our analysis strictly reviews what is
              in your document—never inventing qualifications, roles, or skills you do not
              have.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#14253D]/20 bg-[#F3F1EB] text-[#14253D] hover:border-[#B89450] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            Load Sample CV
          </button>
        </div>

        <div>
          <label
            htmlFor="cv-analyser-input"
            className="block text-sm font-medium text-[#14253D] mb-2"
          >
            Paste Your CV or Resume Text
          </label>
          <textarea
            id="cv-analyser-input"
            rows={11}
            value={cvText}
            onChange={(e) => {
              setCvText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your education, academic projects, work experience, skills, and summary here..."
            className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-3 text-sm text-[#14253D] leading-relaxed placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[#14253D]/55">
            <span>Plain text works best. Remove sensitive personal ID numbers if preferred.</span>
            <span className="font-mono tabular-nums">
              {cvText.length.toLocaleString()} characters
            </span>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading && !cvText && !result}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#14253D]/20 bg-white text-sm font-medium text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Form</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyse}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-semibold hover:bg-[#1C3352] disabled:opacity-70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#DFCCA6]" aria-hidden="true" />
                <span>Analysing CV...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                <span>Analyse My CV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div
          aria-live="polite"
          className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-2">
            <div className="h-4 w-40 bg-[#F3F1EB] rounded" />
            <div className="h-6 w-72 bg-[#F3F1EB] rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#F3F1EB] rounded" />
            <div className="h-4 w-11/12 bg-[#F3F1EB] rounded" />
            <div className="h-4 w-3/4 bg-[#F3F1EB] rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#14253D]/10">
            <div className="h-28 bg-[#F3F1EB] rounded-lg" />
            <div className="h-28 bg-[#F3F1EB] rounded-lg" />
          </div>
        </div>
      )}

      {/* Results View */}
      {!loading && result && (
        <section
          aria-live="polite"
          className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#14253D]/10">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                Structured CV Report
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#14253D] mt-1">
                Analysis Results
              </h2>
            </div>
            <CopyButton
              text={formatAnalysisForCopy(result)}
              label="Copy Full Report"
            />
          </div>

          {/* Overall Assessment & Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <h3 className="text-base font-semibold text-[#14253D]">
                Overall CV Assessment
              </h3>
              <p className="text-sm text-[#14253D]/85 leading-relaxed">
                {result.overallAssessment}
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-base font-semibold text-[#14253D]">
                Professional Presentation &amp; Structure
              </h3>
              <p className="text-sm text-[#14253D]/85 leading-relaxed">
                {result.presentationAndStructure}
              </p>
            </div>
          </div>

          <hr className="border-[#14253D]/10" />

          {/* Identified Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ResultListSection
              title="Skills Identified"
              items={result.skillsIdentified}
              emptyText="No explicit skills section or skill keywords were detected."
            />
            <ResultListSection
              title="Education & Qualifications"
              items={result.educationAndQualifications}
              emptyText="No formal education or qualification entries were found."
            />
            <ResultListSection
              title="Projects & Experience"
              items={result.projectsAndExperience}
              emptyText="No work experience or academic projects were detected."
            />
          </div>

          <hr className="border-[#14253D]/10" />

          {/* Strengths, Improvements, Missing Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Strengths of the CV
                </h3>
              </div>
              <BulletList
                items={result.strengths}
                emptyText="No clear strengths identified yet."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Areas That Could Be Improved
                </h3>
              </div>
              <BulletList
                items={result.areasToImprove}
                emptyText="No major improvements flagged."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Missing or Unclear Information
                </h3>
              </div>
              <BulletList
                items={result.missingOrUnclearInformation}
                emptyText="All key sections appear clearly documented."
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ResultListSection({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-[#14253D]">{title}</h3>
      <BulletList items={items} emptyText={emptyText} />
    </div>
  );
}

function BulletList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-[#14253D]/60 italic">{emptyText}</p>;
  }
  return (
    <ul className="space-y-2.5 text-sm text-[#14253D]/85 leading-relaxed">
      {items.map((item, idx) => (
        <li key={`${idx}-${item.slice(0, 20)}`} className="flex items-start gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#B89450] shrink-0 mt-2"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
