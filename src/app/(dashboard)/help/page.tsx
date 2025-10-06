"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Book, ChevronRight, Mail, Clock } from "lucide-react";
import {
  HELP_CATEGORIES,
  HELP_ARTICLES,
  searchHelpArticles,
  getArticlesByCategory,
} from "@/lib/help-content";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(HELP_ARTICLES);

  React.useEffect(() => {
    const results = searchHelpArticles(searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  const popularArticles = HELP_ARTICLES.slice(0, 6);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
          <Book className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white">Help Center</h1>
        <p className="mt-2 text-lg text-slate-400">
          Find answers and learn how to get the most out of your CRM
        </p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-12 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4 rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
            <p className="mb-3 text-sm font-medium text-slate-400">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-2">
              {searchResults.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3 transition-all hover:border-slate-700/50 hover:bg-slate-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {article.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {article.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {!searchQuery && (
        <>
          {/* Categories */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-white">Browse by Category</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {HELP_CATEGORIES.map((category) => {
                const articleCount = getArticlesByCategory(category.id).length;
                return (
                  <div
                    key={category.id}
                    className="group cursor-pointer rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-6 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg"
                  >
                    <div className="mb-3 text-3xl">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {category.description}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      {articleCount} article{articleCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-white">Popular Articles</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-6 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Still Need Help?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="mailto:support@example.com"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </a>
            <p className="mt-4 text-xs text-slate-500">
              Average response time: 24 hours
            </p>
          </div>
        </>
      )}
    </div>
  );
}
