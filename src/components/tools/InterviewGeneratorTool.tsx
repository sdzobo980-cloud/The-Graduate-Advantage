import {
  AlertCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_INTERVIEW_INPUT } from '../../data/sampleData.ts';
import { requestInterviewQuestions } from '../../services/careerApi.ts';
import type {
  ExperienceLevel,
  InterviewQuestionItem,
  InterviewQuestionsResult,
} from '../../types/career.ts';
import { CopyButton } from '../CopyButton.tsx';

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Student',
  'Recent Graduate',
  'Experienced Applicant',
];

function formatInterviewForCopy(result: InterviewQuestionsResult): string {
  const formatGroup = (title: string, items: InterviewQuestionItem[]) => {
    const body = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.question}\n   Focus: ${item.focusOrContext}\n   Suggested structure: ${item.suggestedAnswerStructure}`,
      )
      .join('\n\n');
    return `${title}\n${body}`;
  };

  const behavioural = result.behaviouralQuestions
    .map(
      (b, idx) =>
        `${idx + 1}. ${b.question} (${b.competency})\n   Situation: ${b.starStructure.situation}\n   Task: ${b.starStructure.task}\n   Action: ${b.starStructure.action}\n   Result: ${b.starStructure.result}`,
    )
    .join('\n\n');

  const askInterviewer = result.questionsToAskInterviewer
    .map((q, idx) => `${idx + 1}. ${q.question}\n   Purpose: ${q.purpose}`)
    .join('\n\n');

  return [
    'THE GRADUATE ADVANTAGE — INTERVIEW PREPARATION GUIDE',
    '',
    result.preparationOverview,
    '',
    'STAR METHOD GUIDE',
    `- Situation: ${result.starMethodGuide.situation}`,
    `- Task: ${result.starMethodGuide.task}`,
    `- Action: ${result.starMethodGuide.action}`,
    `- Result: ${result.starMethodGuide.result}`,
    `Reminder: ${result.starMethodGuide.truthfulnessNote}`,
    '',
    formatGroup('GENERAL INTERVIEW QUESTIONS', result.generalQuestions),
    '',
    formatGroup('ROLE-SPECIFIC TECHNICAL QUESTIONS', result.technicalQuestions),
    '',
    `BEHAVIOURAL QUESTIONS (STAR METHOD)\n${behavioural}`,
    '',
    formatGroup('PROBLEM-SOLVING QUESTIONS', result.problemSolvingQuestions),
    '',
    formatGroup(
      'ACADEMIC PROJECTS & INTERNSHIPS',
      result.academicAndInternshipQuestions,
    ),
    '',
    `QUESTIONS YOU CAN ASK THE INTERVIEWER\n${askInterviewer}`,
  ].join('\n\n');
}

export function InterviewGeneratorTool() {
  const [jobTitle, setJobTitle] = useState('');
  const [companyOrIndustry, setCompanyOrIndustry] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>('Recent Graduate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewQuestionsResult | null>(null);

  async function handleGenerate() {
    setError(null);
    if (!jobTitle.trim()) {
      setError('Please enter a target job title before generating interview questions.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestInterviewQuestions({
        jobTitle: jobTitle.trim(),
        companyOrIndustry: companyOrIndustry.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        experienceLevel,
      });
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate interview questions right now.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLoadSample() {
    setJobTitle(SAMPLE_INTERVIEW_INPUT.jobTitle);
    setCompanyOrIndustry(SAMPLE_INTERVIEW_INPUT.companyOrIndustry);
    setJobDescription(SAMPLE_INTERVIEW_INPUT.jobDescription);
    setExperienceLevel(SAMPLE_INTERVIEW_INPUT.experienceLevel);
    setError(null);
  }

  function handleReset() {
    setJobTitle('');
    setCompanyOrIndustry('');
    setJobDescription('');
    setExperienceLevel('Recent Graduate');
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B89450]">
              <span className="font-mono tabular-nums">04.</span>
              <span>Interview Question Generator</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#14253D]">
              Prepare structured interview answers
            </h1>
            <p className="text-sm text-[#14253D]/75 max-w-2xl leading-relaxed">
              Generate role-specific general, technical, behavioural (STAR), and
              project-focused questions tailored to your experience stage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#14253D]/20 bg-[#F3F1EB] text-[#14253D] hover:border-[#B89450] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            Load Sample Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="interview-job-title"
              className="block text-sm font-medium text-[#14253D] mb-1.5"
            >
              Job Title
            </label>
            <input
              id="interview-job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Graduate Data Analyst, Junior Product Associate"
              className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
            />
          </div>

          <div>
            <label
              htmlFor="interview-company"
              className="block text-sm font-medium text-[#14253D] mb-1.5"
            >
              Company or Industry{' '}
              <span className="font-normal text-[#14253D]/55">(Optional)</span>
            </label>
            <input
              id="interview-company"
              type="text"
              value={companyOrIndustry}
              onChange={(e) => setCompanyOrIndustry(e.target.value)}
              placeholder="e.g. Public Sector, FinTech, Civil Engineering"
              className="w-full rounded-lg border border-[#14253D]/20 bg-white px-4 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[#14253D] mb-2">
            Experience Level
          </span>
          <div
            role="radiogroup"
            aria-label="Experience Level"
            className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#F3F1EB] rounded-lg border border-[#14253D]/10"
          >
            {EXPERIENCE_LEVELS.map((level) => {
              const selected = experienceLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setExperienceLevel(level)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[#14253D] text-white shadow-sm'
                      : 'text-[#14253D]/75 hover:text-[#14253D] hover:bg-white/60'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="interview-jd"
            className="block text-sm font-medium text-[#14253D] mb-1.5"
          >
            Job Description{' '}
            <span className="font-normal text-[#14253D]/55">(Optional)</span>
          </label>
          <textarea
            id="interview-jd"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Optionally paste the job description to focus questions on specific responsibilities and tools..."
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
            disabled={loading && !jobTitle && !companyOrIndustry && !jobDescription && !result}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#14253D]/20 bg-white text-sm font-medium text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Form</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-semibold hover:bg-[#1C3352] disabled:opacity-70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#DFCCA6]" aria-hidden="true" />
                <span>Preparing Questions...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                <span>Generate Interview Questions</span>
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
          <div className="h-5 w-56 bg-[#F3F1EB] rounded" />
          <div className="h-24 bg-[#F3F1EB] rounded-lg" />
          <div className="h-32 bg-[#F3F1EB] rounded-lg" />
        </div>
      )}

      {!loading && result && (
        <section aria-live="polite" className="space-y-6">
          {/* Header & Overview */}
          <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#14253D]/10">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                  Tailored Preparation Pack · {experienceLevel}
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#14253D] mt-1">
                  Interview Questions &amp; Answer Structures
                </h2>
              </div>
              <CopyButton
                text={formatInterviewForCopy(result)}
                label="Copy Prep Guide"
              />
            </div>

            <p className="text-sm text-[#14253D]/85 leading-relaxed">
              {result.preparationOverview}
            </p>

            {/* STAR Method Guide */}
            <div className="rounded-xl bg-[#F3F1EB] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#14253D]">
                  Using the STAR Method for Behavioural Questions
                </h3>
                <p className="text-xs text-[#14253D]/75 mt-1">
                  {result.starMethodGuide.truthfulnessNote}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StarCell letter="S" label="Situation" text={result.starMethodGuide.situation} />
                <StarCell letter="T" label="Task" text={result.starMethodGuide.task} />
                <StarCell letter="A" label="Action" text={result.starMethodGuide.action} />
                <StarCell letter="R" label="Result" text={result.starMethodGuide.result} />
              </div>
            </div>
          </div>

          <QuestionGroupSection
            index="01"
            title="General Interview Questions"
            items={result.generalQuestions}
          />

          <QuestionGroupSection
            index="02"
            title="Role-Specific Technical Questions"
            items={result.technicalQuestions}
          />

          {/* Behavioural Questions with STAR prompts */}
          <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="font-mono tabular-nums text-xs font-medium text-[#B89450]">
                03.
              </span>
              <h3 className="font-display text-xl font-semibold text-[#14253D]">
                Behavioural Questions (STAR Framework)
              </h3>
              <p className="text-xs text-[#14253D]/70">
                Use these prompts as a structural guide and replace each part with your own
                authentic university, part-time work, or project example.
              </p>
            </div>

            <div className="space-y-6">
              {result.behaviouralQuestions.map((b, idx) => (
                <div
                  key={`${idx}-${b.question.slice(0, 20)}`}
                  className="pt-5 border-t border-[#14253D]/10 first:pt-0 first:border-t-0 space-y-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#B89450]">
                      Competency · {b.competency}
                    </p>
                    <p className="text-base font-semibold text-[#14253D]">
                      {b.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F3F1EB] rounded-lg p-4 text-xs sm:text-sm text-[#14253D]/85">
                    <div>
                      <span className="font-semibold text-[#14253D]">Situation: </span>
                      <span>{b.starStructure.situation}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#14253D]">Task: </span>
                      <span>{b.starStructure.task}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#14253D]">Action: </span>
                      <span>{b.starStructure.action}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#14253D]">Result: </span>
                      <span>{b.starStructure.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <QuestionGroupSection
            index="04"
            title="Problem-Solving Questions"
            items={result.problemSolvingQuestions}
          />

          <QuestionGroupSection
            index="05"
            title="Academic Projects & Internship Questions"
            items={result.academicAndInternshipQuestions}
          />

          {/* Questions to ask interviewer */}
          <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <span className="font-mono tabular-nums text-xs font-medium text-[#B89450]">
                06.
              </span>
              <h3 className="font-display text-xl font-semibold text-[#14253D]">
                Questions You Can Ask the Interviewer
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.questionsToAskInterviewer.map((q, idx) => (
                <div
                  key={`${idx}-${q.question.slice(0, 15)}`}
                  className="rounded-lg border border-[#14253D]/12 p-4 space-y-1.5"
                >
                  <p className="text-sm font-semibold text-[#14253D]">{q.question}</p>
                  <p className="text-xs text-[#14253D]/70 leading-relaxed">
                    {q.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StarCell({
  letter,
  label,
  text,
}: {
  letter: string;
  label: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-[#14253D]/10 p-3.5 space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#14253D]">
        <span className="font-mono text-[#B89450]">{letter}</span>
        <span>{label}</span>
      </div>
      <p className="text-xs text-[#14253D]/80 leading-relaxed">{text}</p>
    </div>
  );
}

function QuestionGroupSection({
  index,
  title,
  items,
}: {
  index: string;
  title: string;
  items: InterviewQuestionItem[];
}) {
  return (
    <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 space-y-5">
      <div className="space-y-1">
        <span className="font-mono tabular-nums text-xs font-medium text-[#B89450]">
          {index}.
        </span>
        <h3 className="font-display text-xl font-semibold text-[#14253D]">{title}</h3>
      </div>

      <div className="space-y-5">
        {items.map((item, idx) => (
          <div
            key={`${idx}-${item.question.slice(0, 20)}`}
            className="pt-5 border-t border-[#14253D]/10 first:pt-0 first:border-t-0 space-y-2.5"
          >
            <p className="text-base font-semibold text-[#14253D]">{item.question}</p>
            <p className="text-xs text-[#B89450] font-medium">
              What they are looking for: {item.focusOrContext}
            </p>
            <div className="rounded-lg bg-[#F3F1EB] p-4 text-sm text-[#14253D]/85 leading-relaxed">
              <span className="font-semibold text-[#14253D]">
                Suggested answer structure (personalise truthfully):{' '}
              </span>
              {item.suggestedAnswerStructure}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
