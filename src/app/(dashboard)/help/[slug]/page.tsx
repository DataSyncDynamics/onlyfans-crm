"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ThumbsUp, ThumbsDown, Clock, Tag } from "lucide-react";
import { getArticleById, HELP_ARTICLES } from "@/lib/help-content";
import ReactMarkdown from "react-markdown";

export default function HelpArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticleById(slug);
  const [feedbackGiven, setFeedbackGiven] = React.useState(false);

  if (!article) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
          <p className="mt-2 text-slate-400">
            The help article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/help"
            className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = HELP_ARTICLES.filter(
    (a) =>
      a.id !== article.id &&
      (a.category === article.category ||
        a.tags.some((tag) => article.tags.includes(tag)))
  ).slice(0, 3);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        {/* Article Header */}
        <div className="mt-6 rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8">
          <h1 className="text-3xl font-bold text-white">{article.title}</h1>
          <p className="mt-2 text-lg text-slate-400">{article.description}</p>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {article.lastUpdated.toLocaleDateString()}
            </span>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <div className="flex gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/50 px-2 py-0.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="mt-8 rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8">
          <div className="prose prose-invert prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => (
                  <h1 className="mb-4 text-2xl font-bold text-white" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="mb-3 mt-8 text-xl font-semibold text-white" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="mb-2 mt-6 text-lg font-semibold text-white" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-4 leading-relaxed text-slate-300" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-2 text-slate-300" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-2 text-slate-300" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="text-slate-300" {...props} />
                ),
                code: ({ ...props }) => (
                  <code
                    className="rounded bg-slate-800/50 px-1.5 py-0.5 text-sm text-blue-400"
                    {...props}
                  />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-semibold text-white" {...props} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-8 rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-6">
          <h3 className="text-lg font-semibold text-white">
            Was this article helpful?
          </h3>
          {feedbackGiven ? (
            <p className="mt-2 text-sm text-slate-400">
              Thanks for your feedback!
            </p>
          ) : (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setFeedbackGiven(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              <button
                onClick={() => setFeedbackGiven(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ThumbsDown className="h-4 w-4" />
                No
              </button>
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Related Articles
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/help/${relatedArticle.id}`}
                  className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg"
                >
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {relatedArticle.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-400">
                    {relatedArticle.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
