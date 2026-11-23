import {
  ArrowRight,
  Briefcase,
  Compass,
  FileSearch,
  FileText,
  GraduationCap,
  MessageSquare,
  PenLine,
} from 'lucide-react';
import { useState } from 'react';
import type { CareerToolId, PageView } from '../types/career.ts';

interface HomePageProps {
  onSelectTool: (tool: CareerToolId) => void;
  onNavigate: (page: PageView) => void;
}

const FEATURE_CARDS: Array<{
  id: CareerToolId;
  index: string;
  title: string;
  description: string;
  outcome: string;
  Icon: typeof FileSearch;
}> = [
  {
    id: 'cv-analyser',
    index: '01',
    title: 'CV ANALYSER',
    description:
      'Paste your existing CV for a clear breakdown of structure, identified skills, education, projects, strengths, and areas where important details are missing.',
    outcome: 'Structured feedback grounded strictly in what you wrote.',
    Icon: FileSearch,
  },
  {
    id: 'job-matcher',
    index: '02',
    title: 'JOB DESCRIPTION MATCHER',
    description:
      'Compare your CV directly against a specific job posting to see matching skills, relevant projects, priority requirements, gaps, and interview topics to prepare.',
    outcome: 'Honest qualitative alignment without arbitrary hiring scores.',
    Icon: Briefcase,
  },
  {
    id: 'cv-improver',
    index: '03',
    title: 'CV IMPROVEMENT ASSISTANT',
    description:
      'Refine weak phrasing across your summary, education, academic projects, internships, and work history with side-by-side original and improved wording.',
    outcome: 'Stronger professional expression that preserves your real facts.',
    Icon: PenLine,
  },
  {
    id: 'interview-generator',
    index: '04',
    title: 'INTERVIEW QUESTION GENERATOR',
    description:
      'Generate role-appropriate general, technical, behavioural, and problem-solving questions complete with STAR method frameworks and questions for your interviewer.',
    outcome: 'Tailored to Students, Recent Graduates, and Experienced Applicants.',
    Icon: MessageSquare,
  },
];

export function HomePage({ onSelectTool, onNavigate }: HomePageProps) {
  const [heroImgError, setHeroImgError] = useState(false);
  const [aboutImgError, setAboutImgError] = useState(false);

  return (
    <div className="bg-[#F3F1EB] text-[#14253D]">
      {/* Hero Section */}
      <section className="border-b border-[#14253D]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-medium tracking-wider uppercase text-[#B89450]">
                <span>The Graduate Advantage</span>
                <span aria-hidden="true">·</span>
                <span>Prepare. Present. Progress.</span>
              </div>

              <h1
                className="font-display font-semibold tracking-tight text-[#14253D] leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                Your Career. Your Next Move.
              </h1>

              <p className="text-base sm:text-lg text-[#14253D]/80 leading-relaxed max-w-xl">
                Practical AI-powered tools to help you prepare your CV, understand job
                opportunities and approach your career with confidence.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onSelectTool('cv-analyser')}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md bg-[#14253D] text-white text-sm font-semibold hover:bg-[#1C3352] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
                >
                  <span>Explore Career Tools</span>
                  <ArrowRight className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[#14253D]/20 bg-white text-[#14253D] text-sm font-medium hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
                >
                  <span>About the Initiative</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#14253D]/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#14253D]/65">
                <span>University Students</span>
                <span aria-hidden="true">·</span>
                <span>Recent Graduates</span>
                <span aria-hidden="true">·</span>
                <span>First-Time Applicants</span>
                <span aria-hidden="true">·</span>
                <span>Young Professionals</span>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="relative w-full min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] rounded-xl overflow-hidden border border-[#14253D]/10 bg-[#14253D]">
                {!heroImgError ? (
                  <img
                    src="/src/assets/images/hero_graduate_career_1795394247039.jpg"
                    alt="A recent university graduate reviewing her CV and laptop at a sunlit desk"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#14253D] to-[#1C3352] text-white">
                    <GraduationCap
                      className="w-12 h-12 text-[#DFCCA6] mb-4"
                      aria-hidden="true"
                    />
                    <p className="font-display text-xl font-medium">
                      The Graduate Advantage
                    </p>
                    <p className="text-sm text-white/75 mt-1">
                      Prepare. Present. Progress.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Main Feature Cards */}
      <section id="career-tools" className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-12 space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
              Career Preparation Suite
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#14253D]"
              style={{ textWrap: 'balance' }}
            >
              Four practical tools built for every stage of your application
            </h2>
            <p className="text-base text-[#14253D]/75 leading-relaxed">
              Whether you are drafting your first graduate CV or preparing for a
              structured competency interview, choose a focused tool below to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURE_CARDS.map((card) => {
              const IconComponent = card.Icon;
              return (
                <article
                  key={card.id}
                  className="bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 flex flex-col justify-between shadow-[0_1px_3px_rgba(20,37,61,0.04)] hover:border-[#B89450] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono tabular-nums text-xs font-medium text-[#B89450]">
                        {card.index}.
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-[#F3F1EB] flex items-center justify-center text-[#14253D]">
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-semibold tracking-tight text-[#14253D]">
                      {card.title}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-[#14253D]/80 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#14253D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-[#14253D]/65 leading-snug">
                      {card.outcome}
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectTool(card.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#14253D] text-white text-sm font-medium hover:bg-[#1C3352] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Short About Section */}
      <section className="bg-white border-t border-[#14253D]/10 py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex">
              <div className="relative w-full min-h-[260px] rounded-xl overflow-hidden border border-[#14253D]/10 bg-[#14253D]">
                {!aboutImgError ? (
                  <img
                    src="/src/assets/images/about_career_bridge_1795394246399.jpg"
                    alt="Career advisor and university graduate discussing CV structure and portfolio presentation"
                    referrerPolicy="no-referrer"
                    onError={() => setAboutImgError(true)}
                    className="w-full h-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#14253D] to-[#1C3352] text-white">
                    <Compass className="w-10 h-10 text-[#DFCCA6] mb-3" aria-hidden="true" />
                    <p className="font-display text-lg font-medium">
                      Bridging University &amp; Employment
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                About The Graduate Advantage
              </p>

              <h2
                className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#14253D]"
                style={{ textWrap: 'balance' }}
              >
                Bridging the gap between university education and professional employment
              </h2>

              <p className="text-base text-[#14253D]/80 leading-relaxed">
                Transitioning from lecture halls, coursework, and campus activities into
                graduate recruitment can feel opaque—especially when you are applying
                with limited formal work history. The Graduate Advantage translates
                what employers look for into clear, honest guidance so you can articulate
                the real value of your academic projects, part-time roles, and degree.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-[#14253D]/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#14253D]">
                    <FileText className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                    <span>Prepare</span>
                  </div>
                  <p className="text-xs text-[#14253D]/70 leading-relaxed">
                    Identify gaps early and map coursework to role requirements.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#14253D]">
                    <PenLine className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                    <span>Present</span>
                  </div>
                  <p className="text-xs text-[#14253D]/70 leading-relaxed">
                    Express real achievements in crisp, employer-ready language.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#14253D]">
                    <Compass className="w-4 h-4 text-[#B89450]" aria-hidden="true" />
                    <span>Progress</span>
                  </div>
                  <p className="text-xs text-[#14253D]/70 leading-relaxed">
                    Walk into interviews with structured STAR stories and thoughtful
                    questions.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#14253D] hover:text-[#B89450] transition-colors cursor-pointer"
                >
                  <span>Read more about The Graduate Advantage</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
