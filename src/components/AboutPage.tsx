import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import type { CareerToolId, PageView } from '../types/career.ts';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onSelectTool: (tool: CareerToolId) => void;
}

const AUDIENCE_GROUPS = [
  {
    index: '01',
    title: 'University Students Preparing to Graduate',
    description:
      'Turn dissertations, laboratory coursework, group projects, and campus leadership into clear, structured CV evidence before final exams.',
  },
  {
    index: '02',
    title: 'Recent University Graduates',
    description:
      'Compare your degree profile against graduate schemes and entry-level job postings so every application highlights relevant capability.',
  },
  {
    index: '03',
    title: 'Graduates With Limited Experience',
    description:
      'Present academic projects, volunteering, and part-time jobs honestly and professionally without feeling pressured to exaggerate.',
  },
  {
    index: '04',
    title: 'Young Professionals',
    description:
      'Refine existing CV sections for your next career step and rehearse role-specific technical and behavioural interviews.',
  },
];

const GUIDING_PRINCIPLES = [
  'Fact-preserving feedback: We never invent degrees, dates, employers, or skills you do not hold.',
  'No arbitrary percentage scores: Real hiring decisions depend on context, not synthetic compatibility percentages.',
  'Structured interview readiness: Behavioural guidance follows the proven STAR method (Situation, Task, Action, Result) for you to personalise truthfully.',
];

export function AboutPage({ onNavigate, onSelectTool }: AboutPageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#F3F1EB] text-[#14253D] py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#14253D]/75 hover:text-[#14253D] transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Homepage</span>
          </button>

          <div className="bg-white rounded-xl border border-[#14253D]/12 p-8 sm:p-12 shadow-[0_1px_3px_rgba(20,37,61,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                  About Us · Prepare. Present. Progress.
                </p>

                <h1
                  className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#14253D]"
                  style={{ textWrap: 'balance' }}
                >
                  Supporting your transition from university into meaningful employment
                </h1>

                <p className="text-base sm:text-lg text-[#14253D]/85 leading-relaxed">
                  The Graduate Advantage is a career-development initiative dedicated to
                  helping university students and graduates navigate the transition from
                  education into employment. Through practical resources, professional
                  guidance and AI-powered career tools, we help individuals prepare,
                  present their abilities and progress towards their professional goals.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectTool('cv-analyser')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-medium hover:bg-[#1C3352] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Open Career Tools</span>
                    <ArrowRight className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#14253D]/20 bg-white text-[#14253D] text-sm font-medium hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Contact Our Team</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex">
                <div className="relative w-full min-h-[260px] rounded-xl overflow-hidden border border-[#14253D]/10 bg-[#14253D]">
                  {!imgError ? (
                    <img
                      src="/src/assets/images/about_career_bridge_1795394246399.jpg"
                      alt="Graduate reviewing career documents with a mentor"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover lg:h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                      <GraduationCap
                        className="w-10 h-10 text-[#DFCCA6] mb-3"
                        aria-hidden="true"
                      />
                      <p className="font-display text-lg">The Graduate Advantage</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who We Serve */}
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
              Who It Is Built For
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#14253D]">
              Designed for early-career clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUDIENCE_GROUPS.map((group) => (
              <div
                key={group.index}
                className="bg-white rounded-xl border border-[#14253D]/12 p-6 space-y-2"
              >
                <span className="font-mono tabular-nums text-xs font-medium text-[#B89450]">
                  {group.index}.
                </span>
                <h3 className="font-display text-lg font-semibold text-[#14253D]">
                  {group.title}
                </h3>
                <p className="text-sm text-[#14253D]/75 leading-relaxed">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="bg-white rounded-xl border border-[#14253D]/12 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
              Our Approach
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#14253D]">
              Practical, ethical AI career guidance
            </h2>
          </div>

          <ul className="space-y-4">
            {GUIDING_PRINCIPLES.map((principle) => (
              <li
                key={principle}
                className="flex items-start gap-3 text-sm sm:text-base text-[#14253D]/85 leading-relaxed"
              >
                <CheckCircle2
                  className="w-5 h-5 text-[#B89450] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
