import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { PageView } from '../types/career.ts';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenTools: () => void;
}

const NAV_ITEMS: Array<{ id: PageView; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'tools', label: 'Career Tools' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ currentPage, onNavigate, onOpenTools }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSelect(page: PageView) {
    setMobileMenuOpen(false);
    onNavigate(page);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#14253D]/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#14253D] hover:text-[#1C3352] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14253D]"
        >
          The Graduate Advantage
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14253D] ${
                  isActive
                    ? 'text-[#14253D]'
                    : 'text-[#14253D]/70 hover:text-[#14253D]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#B89450]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="hidden md:flex items-center shrink-0">
          {currentPage === 'tools' ? (
            <button
              type="button"
              onClick={() => handleSelect('home')}
              className="px-4 py-2 text-sm font-medium rounded-md border border-[#14253D]/20 text-[#14253D] bg-white hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
            >
              Return to Home
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTools();
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-[#14253D] text-white hover:bg-[#1C3352] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
            >
              Start Preparing
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2.5 rounded-md text-[#14253D] hover:bg-[#F3F1EB] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14253D]"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#14253D]/10 bg-white px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F3F1EB] text-[#14253D]'
                    : 'text-[#14253D]/75 hover:bg-[#F3F1EB]/60 hover:text-[#14253D]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#14253D]/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentPage === 'tools') {
                  onNavigate('home');
                } else {
                  onOpenTools();
                }
              }}
              className="w-full px-4 py-2.5 text-sm font-medium rounded-md bg-[#14253D] text-white hover:bg-[#1C3352] transition-colors cursor-pointer"
            >
              {currentPage === 'tools' ? 'Return to Home' : 'Start Preparing'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
