'use client';

import { useState, useEffect, useRef } from 'react';
import { Advocate } from '../db/index';
import { AdvocateCard } from './AdvocateCard';
import { AdvocateFilter } from './AdvocateFilter';

const PAGE_SIZE = 5;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLElement>(null);

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2000);
  };

  useEffect(() => {
    const fetchAdvocates = async () => {
      showStatus('Fetching advocates...');
      const response = await fetch('/api/advocates');
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      showStatus('Advocates loaded!');
    };
    fetchAdvocates();
  }, []);

  function filterAdvocates(
    advocates: Advocate[],
    searchTerm: string
  ): Advocate[] {
    const terms = searchTerm.trim().toLowerCase().split(/\s+/);
    return advocates.filter((advocate) => {
      const advocateProps: string[] = [
        advocate.firstName || '',
        advocate.lastName || '',
        advocate.city || '',
        advocate.degree || '',
        (advocate.yearsOfExperience || 0).toString(),
        (advocate.phoneNumber || '').toString(),
        ...(advocate.specialties || []),
      ].map((v) => v.toLowerCase());
      return terms.every((searchToken) => advocateProps.some((advProp) => advProp.includes(searchToken)));
    });
  }

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setVisibleCount(PAGE_SIZE); // Reset visible count on new search
    const searchTermElement = document.getElementById('search-term');
    if (searchTermElement) {
      searchTermElement.innerHTML = term;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      showStatus('Filter applied!');
    }, 200);
  };

  const onClick = () => {
    setSearchTerm('');
    setVisibleCount(PAGE_SIZE); // Reset visible count on reset
    showStatus('Search reset!');
  };

  const terms = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredAdvocates = filterAdvocates(advocates, searchTerm);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setVisibleCount((prev) =>
          prev + PAGE_SIZE > filteredAdvocates.length ? filteredAdvocates.length : prev + PAGE_SIZE
        );
      }
    };
    const el = listRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, [filteredAdvocates.length]);

  // Reset visible count when filteredAdvocates changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, advocates]);

  return (
    <main className="m-0 flex flex-col gap-0 relative h-screen">
      {/* Fixed header */}
      <header className="flex flex-col items-center py-2 border-b border-gray-200 mb-0 bg-white z-20 sticky top-0">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Solace Advocates
        </h1>
      </header>
      {/* Status overlay box */}
      {status && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-blue-700 text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500 animate-fade">
          {status}
        </div>
      )}
      {/* Fixed filter bar */}
      <div className="flex flex-col gap-4 w-full mx-auto bg-white z-10 sticky top-[56px] px-6 py-2 border-b border-gray-200">
        <AdvocateFilter
          onFilterChange={onFilterChange}
          onClick={onClick}
          value={searchTerm}
        />
      </div>
      {/* Scrollable cards section */}
      <section
        ref={listRef}
        aria-label="Advocate List"
        className="flex-1 overflow-y-auto px-6 pt-4"
        style={{ minHeight: 0 }}
      >
        <ul className="p-0 list-none flex flex-col gap-6">
          {filteredAdvocates.slice(0, visibleCount).map((advocate, idx) => (
            <AdvocateCard key={idx} advocate={advocate} highlightTokens={terms} />
          ))}
        </ul>
        {visibleCount < filteredAdvocates.length && (
          <div className="text-center py-4 text-gray-500">Loading more...</div>
        )}
      </section>
    </main>
  );
}
