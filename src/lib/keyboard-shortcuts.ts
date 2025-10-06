export interface KeyboardShortcut {
  keys: string[];
  description: string;
  action?: () => void;
}

export interface ShortcutCategory {
  category: string;
  shortcuts: KeyboardShortcut[];
}

export const KEYBOARD_SHORTCUTS: ShortcutCategory[] = [
  {
    category: "Navigation",
    shortcuts: [
      {
        keys: ["⌘", "K"],
        description: "Open command palette",
      },
      {
        keys: ["G", "H"],
        description: "Go to home/overview",
      },
      {
        keys: ["G", "C"],
        description: "Go to creators",
      },
      {
        keys: ["G", "F"],
        description: "Go to fans",
      },
      {
        keys: ["G", "R"],
        description: "Go to revenue",
      },
      {
        keys: ["G", "M"],
        description: "Go to chatters (messages)",
      },
    ],
  },
  {
    category: "Actions",
    shortcuts: [
      {
        keys: ["⌘", "N"],
        description: "Create new (context-aware)",
      },
      {
        keys: ["⌘", "S"],
        description: "Save (in forms)",
      },
      {
        keys: ["⌘", "/"],
        description: "Focus search",
      },
      {
        keys: ["Esc"],
        description: "Close modal or dialog",
      },
    ],
  },
  {
    category: "Interface",
    shortcuts: [
      {
        keys: ["?"],
        description: "Show keyboard shortcuts",
      },
      {
        keys: ["⌘", "B"],
        description: "Toggle sidebar",
      },
      {
        keys: ["⌘", "."],
        description: "Open settings",
      },
    ],
  },
  {
    category: "Table Navigation",
    shortcuts: [
      {
        keys: ["↑", "↓"],
        description: "Navigate rows",
      },
      {
        keys: ["Enter"],
        description: "Open selected item",
      },
      {
        keys: ["Space"],
        description: "Select/deselect row",
      },
    ],
  },
];

// Helper to format keys for display
export function formatShortcutKeys(keys: string[]): string {
  return keys.join(" + ");
}

// Helper to check if shortcut matches event
export function matchesShortcut(
  event: KeyboardEvent,
  keys: string[]
): boolean {
  const normalizedKeys = keys.map((k) => k.toLowerCase());

  // Check for modifier keys
  const needsCmd = normalizedKeys.includes("⌘") || normalizedKeys.includes("cmd");
  const needsCtrl = normalizedKeys.includes("ctrl");
  const needsShift = normalizedKeys.includes("shift");
  const needsAlt = normalizedKeys.includes("alt");

  // Get the actual key (remove modifiers)
  const actualKey = normalizedKeys.find(
    (k) => !["⌘", "cmd", "ctrl", "shift", "alt"].includes(k)
  );

  if (!actualKey) return false;

  // Check modifiers
  const cmdOrCtrl = event.metaKey || event.ctrlKey;
  if (needsCmd && !cmdOrCtrl) return false;
  if (needsCtrl && !event.ctrlKey) return false;
  if (needsShift && !event.shiftKey) return false;
  if (needsAlt && !event.altKey) return false;

  // Check the actual key
  const pressedKey = event.key.toLowerCase();
  return pressedKey === actualKey || pressedKey === actualKey.toLowerCase();
}
