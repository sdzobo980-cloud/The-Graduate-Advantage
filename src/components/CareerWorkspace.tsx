import {
  ArrowLeft,
  Briefcase,
  FileSearch,
  MessageSquare,
  PenLine,
} from 'lucide-react';
import type { CareerToolId } from '../types/career.ts';
import { CvAnalyserTool } from './tools/CvAnalyserTool.tsx';
import { CvImproverTool } from './tools/CvImproverTool.tsx';
import { InterviewGeneratorTool } from './tools/InterviewGeneratorTool.tsx';
import { JobMatcherTool } from './tools/JobMatcherTool.tsx';

interface CareerWorkspaceProps {
  activeTool: CareerToolId;
  onSelectTool: (tool: CareerToolId) => void;
  onBackHome: () => void;
}

const TOOL_ITEMS: Array<{
  id: CareerToolId;
  index: string;
  label: string;
  subtitle: string;
  Icon: typeof FileSearch;
}> = [
  {
    id: 'cv-analyser',
    index: '01',
    label: 'CV Analyser',
    subtitle: 'Structure, strengths & gaps',
    Icon: FileSearch,
  },
  {
    id: 'job-matcher',
    index: '02',
    label: 'Job Description Matcher',
    subtitle: 'Compare CV against role',
    Icon: Briefcase,
  },
  {
    id: 'cv-improver',
    index: '03',
    label: 'CV Improvement Assistant',
    subtitle: 'Fact-preserving rewrites',
    Icon: PenLine,
  },
  {
    id: 'interview-generator',
    index: '04',
    label: 'Interview Question Generator',
    subtitle: 'STAR & role prep guide',
    Icon: MessageSquare,
  },
];

export function CareerWorkspace({
  activeTool,
  onSelectTool,
  onBackHome,
}: CareerWorkspaceProps) {
  const currentToolMeta =
    TOOL_ITEMS.find((t) => t.id === activeTool) ?? TOOL_ITEMS[0];

  return (
    <div className="bg-[#F3F1EB] min-h-[calc(100vh-4rem)] py-6 sm:py-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contextual Workspace Breadcrumb & Return Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#14253D]/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#14253D]/70">
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#14253D] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span>Career Tools</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[#14253D]">
              {currentToolMeta.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#14253D]/20 bg-white text-xs sm:text-sm font-medium text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to Homepage</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Desktop Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#14253D]/12 p-3 sm:p-4 shadow-[0_1px_3px_rgba(20,37,61,0.04)]">
              <p className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                Career Suite
              </p>

              <nav
                className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5"
                aria-label="Career Tools Navigation"
              >
                {TOOL_ITEMS.map((item) => {
                  const IconComponent = item.Icon;
                  const isActive = activeTool === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTool(item.id)}
                      className={`w-full text-left px-3.5 py-3 rounded-lg transition-colors cursor-pointer flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D] ${
                        isActive
                          ? 'bg-[#14253D] text-white'
                          : 'text-[#14253D] hover:bg-[#F3F1EB]'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <IconComponent
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isActive ? 'text-[#DFCCA6]' : 'text-[#B89450]'
                        }`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug">
                          <span
                            className={`font-mono tabular-nums text-xs mr-1.5 ${
                              isActive ? 'text-[#DFCCA6]' : 'text-[#B89450]'
                            }`}
                          >
                            {item.index}.
                          </span>
                          {item.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 truncate ${
                            isActive ? 'text-white/75' : 'text-[#14253D]/60'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="hidden lg:block bg-white rounded-xl border border-[#14253D]/12 p-5 space-y-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#14253D]">
                Truthfulness Standard
              </p>
              <p className="text-xs text-[#14253D]/75 leading-relaxed">
                All four tools build strictly from your real academic and professional
                background. Review and personalise every suggestion before submitting an
                application.
              </p>
            </div>
          </aside>

          {/* Main Tool Viewport */}
          <main className="lg:col-span-9 min-w-0">
            {activeTool === 'cv-analyser' && <CvAnalyserTool />}
            {activeTool === 'job-matcher' && <JobMatcherTool />}
            {activeTool === 'cv-improver' && <CvImproverTool />}
            {activeTool === 'interview-generator' && <InterviewGeneratorTool />}
          </main>
        </div>
      </div>
    </div>
  );
}
