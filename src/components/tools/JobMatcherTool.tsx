import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Compass,
  HelpCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_GRADUATE_CV, SAMPLE_JOB_DESCRIPTION } from '../../data/sampleData.ts';
import { requestJobMatch } from '../../services/careerApi.ts';
import type { JobMatchResult } from '../../types/career.ts';
import { CopyButton } from '../CopyButton.tsx';

function formatMatchForCopy(result: JobMatchResult): string {
  const formatList = (items: string[]) =>
    items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : '- None noted';

  return [
    'THE GRADUATE ADVANTAGE — JOB DESCRIPTION MATCH REPORT',
    '',
    'OVERALL MATCH ASSESSMENT',
    result.matchAssessment,
    '',
    'RELEVANT MATCHING SKILLS',
    formatList(result.relevantMatchingSkills),
    '',
    'RELEVANT QUALIFICATIONS',
    formatList(result.relevantQualifications),
    '',
    'RELEVANT EXPERIENCE & PROJECTS',
    formatList(result.relevantExperienceAndProjects),
    '',
    'IMPORTANT JOB REQUIREMENTS',
    formatList(result.importantJobRequirements),
    '',
    'REQUIREMENTS NOT CLEARLY DEMONSTRATED IN CV',
    formatList(result.gapsNotClearlyDemonstrated),
    '',
    'SUGGESTIONS FOR IMPROVING YOUR APPLICATION',
    formatList(result.applicationImprovementSuggestions),
    '',
    'INTERVIEW TOPICS TO PREPARE FOR',
    formatList(result.interviewTopicsToPrepare),
  ].join('\n');
}

export function JobMatcherTool() {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  async function handleCompare() {
    setError(null);
    if (!cvText.trim()) {
      setError('Please paste your CV in the first box before comparing.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the target job description in the second box.');
      return;
    }
    if (cvText.trim().length < 30 || jobDescription.trim().length < 30) {
      setError(
        'Both your CV and the job description should contain at least 30 characters for a meaningful comparison.',
      );
      return;
    }

    setLoading(true);
    try {
      const data = await requestJobMatch(cvText.trim(), jobDescription.trim());
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to compare your CV with this job right now.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLoadSamples() {
    setCvText(SAMPLE_GRADUATE_CV);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setError(null);
  }

  function handleReset() {
    setCvText('');
    setJobDescription('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B89450]">
              <span className="font-mono tabular-nums">02.</span>
              <span>Job Description Matcher</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#14253D]">
              Compare your CV against a target role
            </h1>
            <p className="text-sm text-[#14253D]/75 max-w-2xl leading-relaxed">
              See where your skills, qualifications, and academic projects align with an
              employer&apos;s requirements—and spot uncovered criteria honestly before you
              apply.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSamples}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#14253D]/20 bg-[#F3F1EB] text-[#14253D] hover:border-[#B89450] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            Load Sample CV &amp; Job
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="matcher-cv-input"
              className="block text-sm font-medium text-[#14253D] mb-2"
            >
              Paste Your CV
            </label>
            <textarea
              id="matcher-cv-input"
              rows={11}
              value={cvText}
              onChange={(e) => {
                setCvText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste your CV text here..."
              className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-3 text-sm text-[#14253D] leading-relaxed placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
            />
          </div>

          <div>
            <label
              htmlFor="matcher-jd-input"
              className="block text-sm font-medium text-[#14253D] mb-2"
            >
              Paste the Job Description
            </label>
            <textarea
              id="matcher-jd-input"
              rows={11}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste the job title, responsibilities, and person specification here..."
              className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-3 text-sm text-[#14253D] leading-relaxed placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
            />
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
            disabled={loading && !cvText && !jobDescription && !result}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#14253D]/20 bg-white text-sm font-medium text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Form</span>
          </button>

          <button
            type="button"
            onClick={handleCompare}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-semibold hover:bg-[#1C3352] disabled:opacity-70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#DFCCA6]" aria-hidden="true" />
                <span>Comparing CV &amp; Role...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                <span>Compare My CV With This Job</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div
          aria-live="polite"
          className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-6"
        >
          <div className="h-5 w-48 bg-[#F3F1EB] rounded" />
          <div className="space-y-2.5">
            <div className="h-4 w-full bg-[#F3F1EB] rounded" />
            <div className="h-4 w-5/6 bg-[#F3F1EB] rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#14253D]/10">
            <div className="h-32 bg-[#F3F1EB] rounded-lg" />
            <div className="h-32 bg-[#F3F1EB] rounded-lg" />
          </div>
        </div>
      )}

      {!loading && result && (
        <section
          aria-live="polite"
          className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#14253D]/10">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                Qualitative Alignment Assessment
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#14253D] mt-1">
                Role Comparison Results
              </h2>
            </div>
            <CopyButton
              text={formatMatchForCopy(result)}
              label="Copy Full Report"
            />
          </div>

          <div className="rounded-lg bg-[#F3F1EB] p-5 space-y-2">
            <h3 className="text-sm font-semibold text-[#14253D]">
              Overall Match Assessment
            </h3>
            <p className="text-sm text-[#14253D]/85 leading-relaxed">
              {result.matchAssessment}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MatchColumn
              title="Relevant Matching Skills"
              items={result.relevantMatchingSkills}
              emptyText="No direct skill matches detected yet."
            />
            <MatchColumn
              title="Relevant Qualifications"
              items={result.relevantQualifications}
              emptyText="No directly matching qualifications identified."
            />
            <MatchColumn
              title="Relevant Experience & Projects"
              items={result.relevantExperienceAndProjects}
              emptyText="No directly aligned projects or experience detected."
            />
          </div>

          <hr className="border-[#14253D]/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Important Job Requirements
                </h3>
              </div>
              <BulletList
                items={result.importantJobRequirements}
                emptyText="No priority requirements extracted."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Requirements Not Clearly Demonstrated in Your CV
                </h3>
              </div>
              <BulletList
                items={result.gapsNotClearlyDemonstrated}
                emptyText="No major gaps identified against the listed criteria."
              />
            </div>
          </div>

          <hr className="border-[#14253D]/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#14253D]">
                  Suggestions for Improving Your Application
                </h3>
              </div>
              <BulletList
                items={result.applicationImprovementSuggestions}
                emptyText="No tailored suggestions generated."
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#14253D]">
                Interview Topics to Prepare For
              </h3>
              <BulletList
                items={result.interviewTopicsToPrepare}
                emptyText="No interview topics suggested."
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function MatchColumn({
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
