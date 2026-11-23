import { AlertCircle, Loader2, PenLine, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_GRADUATE_CV } from '../../data/sampleData.ts';
import { requestCvImprovement } from '../../services/careerApi.ts';
import type { CvImprovementResult, CvImprovementSuggestion } from '../../types/career.ts';
import { CopyButton } from '../CopyButton.tsx';

function formatImprovementsForCopy(result: CvImprovementResult): string {
  const sections = result.suggestions.map((item) =>
    [
      `=== ${item.section.toUpperCase()} ===`,
      `Original wording:\n${item.originalWording}`,
      '',
      `Suggested improved wording:\n${item.suggestedWording}`,
      '',
      `Why this is better:\n${item.explanation}`,
    ].join('\n'),
  );

  return [
    'THE GRADUATE ADVANTAGE — CV IMPROVEMENT SUGGESTIONS',
    '',
    result.overviewNotes,
    '',
    ...sections,
    '',
    'FORMATTING & CLARITY TIPS',
    ...result.formattingAndClarityTips.map((tip) => `- ${tip}`),
  ].join('\n\n');
}

function getStatusLabel(status: CvImprovementSuggestion['status']): string {
  switch (status) {
    case 'improved':
      return 'Refined wording suggested';
    case 'already_strong':
      return 'Already clearly written';
    case 'not_present':
      return 'Section not present in CV';
  }
}

export function CvImproverTool() {
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CvImprovementResult | null>(null);

  async function handleImprove() {
    setError(null);
    if (!cvText.trim()) {
      setError('Please paste your existing CV text before clicking Improve My CV.');
      return;
    }
    if (cvText.trim().length < 30) {
      setError('Please enter at least 30 characters of your CV so we can suggest improvements.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestCvImprovement(
        cvText.trim(),
        targetRole.trim() || undefined,
      );
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate CV improvements right now.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLoadSample() {
    setCvText(SAMPLE_GRADUATE_CV);
    setTargetRole('Graduate Data & Operations Analyst');
    setError(null);
  }

  function handleReset() {
    setCvText('');
    setTargetRole('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B89450]">
              <span className="font-mono tabular-nums">03.</span>
              <span>CV Improvement Assistant</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#14253D]">
              Strengthen your wording without inventing facts
            </h1>
            <p className="text-sm text-[#14253D]/75 max-w-2xl leading-relaxed">
              Paste your current CV and optionally specify your target role or industry.
              We rewrite passive phrasing into clear, employer-ready language while
              strictly preserving your real background.
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
            htmlFor="improver-target-role"
            className="block text-sm font-medium text-[#14253D] mb-1.5"
          >
            Target Job Title or Industry{' '}
            <span className="font-normal text-[#14253D]/55">(Optional)</span>
          </label>
          <input
            id="improver-target-role"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Graduate Software Engineer, Financial Services, Marketing Coordinator"
            className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
          />
        </div>

        <div>
          <label
            htmlFor="improver-cv-input"
            className="block text-sm font-medium text-[#14253D] mb-2"
          >
            Existing CV Text
          </label>
          <textarea
            id="improver-cv-input"
            rows={11}
            value={cvText}
            onChange={(e) => {
              setCvText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your existing CV text here..."
            className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-3 text-sm text-[#14253D] leading-relaxed placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
          />
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
            disabled={loading && !cvText && !targetRole && !result}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#14253D]/20 bg-white text-sm font-medium text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Form</span>
          </button>

          <button
            type="button"
            onClick={handleImprove}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-semibold hover:bg-[#1C3352] disabled:opacity-70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#DFCCA6]" aria-hidden="true" />
                <span>Improving Wording...</span>
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                <span>Improve My CV</span>
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
          <div className="h-5 w-52 bg-[#F3F1EB] rounded" />
          <div className="h-28 bg-[#F3F1EB] rounded-lg" />
          <div className="h-28 bg-[#F3F1EB] rounded-lg" />
        </div>
      )}

      {!loading && result && (
        <section aria-live="polite" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                  Fact-Preserving Revisions
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#14253D] mt-1">
                  Section-by-Section Improvements
                </h2>
              </div>
              <CopyButton
                text={formatImprovementsForCopy(result)}
                label="Copy All Suggestions"
              />
            </div>
            <p className="text-sm text-[#14253D]/80 leading-relaxed">
              {result.overviewNotes}
            </p>
          </div>

          <div className="space-y-5">
            {result.suggestions.map((item, idx) => (
              <article
                key={`${item.section}-${idx}`}
                className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#14253D]/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#14253D]/60 mb-1">
                      <span className="font-mono tabular-nums text-[#B89450]">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{getStatusLabel(item.status)}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#14253D]">
                      {item.section}
                    </h3>
                  </div>

                  <CopyButton
                    text={item.suggestedWording}
                    label="Copy Suggested Text"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#14253D]/55">
                      Original Wording
                    </p>
                    <div className="rounded-lg bg-[#F3F1EB] p-4 text-sm text-[#14253D]/80 leading-relaxed whitespace-pre-line">
                      {item.originalWording}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                      Suggested Improved Wording
                    </p>
                    <div className="rounded-lg border border-[#B89450]/40 bg-white p-4 text-sm text-[#14253D] leading-relaxed whitespace-pre-line">
                      {item.suggestedWording}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#14253D]/10">
                  <p className="text-xs font-semibold text-[#14253D] mb-1">
                    Why this suggestion is better
                  </p>
                  <p className="text-sm text-[#14253D]/80 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {result.formattingAndClarityTips.length > 0 && (
            <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-xl font-semibold text-[#14253D]">
                General Formatting &amp; Clarity Recommendations
              </h3>
              <ul className="space-y-2.5 text-sm text-[#14253D]/85 leading-relaxed">
                {result.formattingAndClarityTips.map((tip, i) => (
                  <li key={`${i}-${tip.slice(0, 15)}`} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#B89450] shrink-0 mt-2"
                      aria-hidden="true"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
