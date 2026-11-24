import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/FeedbackStates';
import { SearchBar } from '../../components/common/SearchBar';
import { useLanguage } from '../../context/LanguageContext';
import { mockKnowledgeArticles } from '../../data/mockKnowledge';

const CATEGORIES = [
  'All',
  'Melon Diseases',
  'Symptoms',
  'Prevention',
  'Crop Care',
  'Weather and Farming',
  'General Agricultural Guidance',
] as const;

export const KnowledgeCenterPage: React.FC = () => {
  const { language } = useLanguage();
  const [category, setCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return mockKnowledgeArticles.filter((art) => {
      if (category !== 'All' && art.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          art.title.en.toLowerCase().includes(q) ||
          art.title.ur.includes(query) ||
          art.summary.en.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, query]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Knowledge Center' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[#17251B]">
          Agricultural Knowledge Center
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Bilingual educational guides on melon diseases, symptoms, prevention, and weather readiness
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-[#64748B]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
        <p>
          These articles are <span className="font-semibold text-[#17251B]">demonstration educational resources</span> designed for field awareness. Always verify local crop protection practices with certified agricultural extension services.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search melon care guides..."
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                category === cat
                  ? 'bg-[#166534] text-white'
                  : 'border border-slate-200 bg-[#F7FAF7] text-[#64748B] hover:text-[#166534]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No guides found"
          description="Try selecting another category or clearing your search query."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:shadow-md flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={art.imageUrl}
                  alt={art.title[language]}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 start-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                  {art.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-base font-bold text-[#17251B] leading-snug">
                  {art.title[language]}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#64748B]">
                  {art.summary[language]}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                    <Clock className="h-3.5 w-3.5" />
                    {art.readTimeMinutes} min read
                  </span>
                  <Link
                    to={`/farmer/knowledge/${art.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Read More
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
