import type { CareerToolId, PageView } from '../types/career.ts';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSelectTool: (tool: CareerToolId) => void;
}

export function Footer({ onNavigate, onSelectTool }: FooterProps) {
  return (
    <footer className="bg-[#14253D] text-white border-t border-[#14253D]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-3">
            <p className="font-display text-lg font-semibold tracking-wide text-white uppercase">
              THE GRADUATE ADVANTAGE
            </p>
            <p className="text-sm font-medium text-[#DFCCA6]">
              Prepare. Present. Progress.
            </p>
            <p className="text-sm text-white/75 leading-relaxed max-w-md">
              Practical AI-powered career preparation tools built to help university
              students, recent graduates, and young professionals present their real
              abilities with clarity.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#DFCCA6]">
              Navigation
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Career Tools
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#DFCCA6]">
              Career Tools
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('cv-analyser')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  01. CV Analyser
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('job-matcher')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  02. Job Description Matcher
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('cv-improver')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  03. CV Improvement Assistant
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('interview-generator')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  04. Interview Question Generator
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/65">
          <p>
            © {new Date().getFullYear()} The Graduate Advantage. Designed for honest,
            practical career preparation.
          </p>
          <p>
            Guidance preserves your authentic history — never invent qualifications or
            experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
