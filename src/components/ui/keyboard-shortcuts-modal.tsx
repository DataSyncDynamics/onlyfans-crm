"use client";

import * as React from "react";
import { X, Search, Command } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/lib/keyboard-shortcuts";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

// Component to render individual keyboard keys
function KeyboardKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-slate-700 bg-slate-800 px-2 font-mono text-xs font-semibold text-slate-300 shadow-sm">
      {children}
    </kbd>
  );
}

// Component to render a shortcut row
function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
      <span className="text-sm text-slate-300">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <KeyboardKey>{key}</KeyboardKey>
            {index < keys.length - 1 && (
              <span className="text-xs text-slate-600 mx-0.5">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter shortcuts based on search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return KEYBOARD_SHORTCUTS;

    const query = searchQuery.toLowerCase();
    return KEYBOARD_SHORTCUTS.map((category) => ({
      ...category,
      shortcuts: category.shortcuts.filter(
        (shortcut) =>
          shortcut.description.toLowerCase().includes(query) ||
          shortcut.keys.some((key) => key.toLowerCase().includes(query))
      ),
    })).filter((category) => category.shortcuts.length > 0);
  }, [searchQuery]);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 fade-in duration-200">
        <div className="mx-4 rounded-xl border border-slate-800/50 bg-slate-950 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/50 p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                <Command className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
                <p className="text-sm text-slate-400">
                  Navigate faster with keyboard commands
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-slate-800/50 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
            </div>
          </div>

          {/* Shortcuts List */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 rounded-full bg-slate-800/50 p-3">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-white">No shortcuts found</p>
                <p className="mt-1 text-xs text-slate-400">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div key={category.category}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {category.category}
                    </h3>
                    <div className="space-y-1 rounded-lg border border-slate-800/50 bg-slate-900/30 p-1">
                      {category.shortcuts.map((shortcut, index) => (
                        <ShortcutRow
                          key={index}
                          keys={shortcut.keys}
                          description={shortcut.description}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800/50 px-6 py-4">
            <p className="text-xs text-slate-500">
              Press <KeyboardKey>?</KeyboardKey> anytime to open this dialog
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
