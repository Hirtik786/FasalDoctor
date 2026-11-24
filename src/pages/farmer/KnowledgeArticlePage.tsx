import React from 'react';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/FeedbackStates';
import { useLanguage } from '../../context/LanguageContext';
import { mockKnowledgeArticles } from '../../data/mockKnowledge';

export const KnowledgeArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, setLanguage } = useLanguage();
  const article = mockKnowledgeArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <EmptyState
        title="Article not found"
        description="The requested educational guide does not exist."
        action={
          <Link
            to="/farmer/knowledge"
            className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Knowledge Center
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Knowledge Center', to: '/farmer/knowledge' },
          { label: article.category },
        ]}
      />

      <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        <div className="h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={article.imageUrl}
            alt={article.title[language]}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#166534]">
              {article.category}
            </span>
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-lg px-2.5 py-1 font-semibold ${
                  language === 'en' ? 'bg-[#166534] text-white' : 'text-[#64748B]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`rounded-lg px-2.5 py-1 font-semibold ${
                  language === 'ur' ? 'bg-[#166534] text-white' : 'text-[#64748B]'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-[#17251B] sm:text-3xl">
            {article.title[language]}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
            <span>
              Demonstration Educational Article — Please verify chemical or agronomic measures with your local agricultural extension department.
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#17251B]">
            {article.content[language].map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/farmer/knowledge"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              Back to Knowledge Center
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
