/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AboutPage } from './components/AboutPage.tsx';
import { CareerWorkspace } from './components/CareerWorkspace.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './components/HomePage.tsx';
import { Navbar } from './components/Navbar.tsx';
import type { CareerToolId, PageView } from './types/career.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeTool, setActiveTool] = useState<CareerToolId>('cv-analyser');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeTool]);

  function handleNavigate(page: PageView) {
    setCurrentPage(page);
  }

  function handleSelectTool(tool: CareerToolId) {
    setActiveTool(tool);
    setCurrentPage('tools');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EB] text-[#14253D]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenTools={() => handleSelectTool(activeTool)}
      />

      <div className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectTool={handleSelectTool}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'tools' && (
          <CareerWorkspace
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onBackHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onSelectTool={handleSelectTool}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
      </div>

      <Footer
        onNavigate={handleNavigate}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
