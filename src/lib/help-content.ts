export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  lastUpdated: Date;
  tags: string[];
}

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Learn the basics of using the CRM",
    icon: "🚀",
  },
  {
    id: "creators",
    name: "Managing Creators",
    description: "Add and manage your OnlyFans creators",
    icon: "👥",
  },
  {
    id: "fans",
    name: "Fan Engagement",
    description: "Track and engage with your fan base",
    icon: "❤️",
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    description: "Understand your revenue and performance",
    icon: "📊",
  },
  {
    id: "chatters",
    name: "Chatters & Team",
    description: "Manage your chat team",
    icon: "💬",
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    icon: "🔧",
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "welcome",
    title: "Welcome to VaultCRM",
    description: "Get started with your agency management platform",
    category: "getting-started",
    content: `# Welcome to VaultCRM

Welcome to your all-in-one platform for managing your OnlyFans agency. VaultCRM helps you track creators, engage with fans, manage chatters, and analyze revenue all in one place.

## Key Features

- **Dashboard Overview**: See your agency performance at a glance
- **Creator Management**: Track all your creators and their metrics
- **Fan Database**: Understand your top spenders and engagement
- **Revenue Analytics**: Deep dive into your income streams
- **Chatter Performance**: Monitor your chat team's effectiveness
- **Notifications**: Stay updated on important events

## Getting Started

1. Explore the dashboard to see your agency overview
2. Add your creators in the Creators section
3. Set up your notification preferences
4. Start tracking fan engagement and revenue

Need help? Check out our other articles or contact support.`,
    lastUpdated: new Date(),
    tags: ["welcome", "getting-started", "overview"],
  },
  {
    id: "adding-creators",
    title: "Adding Your First Creator",
    description: "Learn how to add and manage creators",
    category: "creators",
    content: `# Adding Your First Creator

Creators are the heart of your agency. Here's how to add them to your CRM.

## Steps to Add a Creator

1. Navigate to the **Creators** page
2. Click the **"Add Creator"** button in the top right
3. Fill in the creator details:
   - Display Name
   - OnlyFans Username
   - Subscription Price
   - Bio (optional)
   - Tags (optional)

## Creator Status

Each creator has a status:
- **Active**: Currently working with your agency
- **Inactive**: Temporarily not active
- **Suspended**: Account suspended

## Best Practices

- Keep creator information up to date
- Use tags to organize creators by niche or region
- Review creator performance regularly

Once added, creators will appear on your dashboard with their metrics.`,
    lastUpdated: new Date(),
    tags: ["creators", "setup", "management"],
  },
  {
    id: "fan-tiers",
    title: "Understanding Fan Tiers",
    description: "Learn about whale, high, medium, and low tier fans",
    category: "fans",
    content: `# Understanding Fan Tiers

The CRM automatically categorizes fans into tiers based on their spending behavior.

## Tier Definitions

### 🐋 Whale ($5,000+)
Your top spenders. These fans contribute the most revenue and deserve special attention.

### 💎 High Tier ($1,000 - $4,999)
Consistent high-value fans who regularly purchase content and send tips.

### 💰 Medium Tier ($250 - $999)
Regular subscribers who occasionally purchase PPV or send tips.

### 💵 Low Tier ($0 - $249)
New or occasional fans. Great potential for growth.

## How Tiers Are Calculated

Fan tiers are based on **total lifetime spending**, including:
- Subscription fees
- Tips
- PPV purchases
- Message purchases

Tiers update automatically as fans spend more.

## Using Tier Information

- Focus high-touch service on whales
- Create targeted campaigns for each tier
- Track tier migration over time
- Set notification thresholds by tier`,
    lastUpdated: new Date(),
    tags: ["fans", "tiers", "revenue", "engagement"],
  },
  {
    id: "revenue-tracking",
    title: "Revenue Tracking & Analytics",
    description: "Understand your revenue streams and trends",
    category: "analytics",
    content: `# Revenue Tracking & Analytics

The Revenue page gives you deep insights into your agency's income.

## Revenue Types

The CRM tracks four revenue streams:

1. **Subscriptions**: Monthly recurring revenue
2. **Tips**: One-time fan contributions
3. **PPV (Pay Per View)**: Premium content purchases
4. **Messages**: Paid message interactions

## Key Metrics

### Growth Rate
Shows percentage change compared to previous period.

### Revenue by Source
Pie chart showing breakdown by revenue type.

### Trends
Daily, weekly, or monthly revenue charts.

### Top Creators
See which creators generate the most revenue.

## Time Periods

Toggle between:
- Last 7 days
- Last 30 days
- Last 90 days

## Exporting Data

Click "Export" to download revenue data as CSV for accounting or analysis.`,
    lastUpdated: new Date(),
    tags: ["revenue", "analytics", "reporting", "metrics"],
  },
  {
    id: "chatter-management",
    title: "Managing Your Chat Team",
    description: "Track chatter performance and shifts",
    category: "chatters",
    content: `# Managing Your Chat Team

Chatters are crucial for fan engagement. Here's how to manage them effectively.

## Chatter Roles

- **Lead**: Experienced chatters managing the team
- **Senior**: Proven performers with high conversion
- **Junior**: New chatters still learning

## Performance Metrics

Each chatter is tracked on:

- **Messages Sent**: Total message count
- **Revenue Generated**: Direct revenue attributed
- **Response Time**: Average time to reply
- **Conversion Rate**: % of conversations leading to purchases
- **Performance Score**: A-F grade based on overall performance

## Assigning Creators

Chatters can be assigned to specific creators:
1. Go to Chatters page
2. Click on a chatter
3. Select assigned creators

## Shift Management

Track:
- Hours worked this week
- Shifts completed
- Current status (Active/On Break/Offline)

## Best Practices

- Review performance weekly
- Provide feedback regularly
- Rotate high performers across creators
- Set response time goals`,
    lastUpdated: new Date(),
    tags: ["chatters", "team", "performance", "management"],
  },
  {
    id: "notifications-setup",
    title: "Setting Up Notifications",
    description: "Customize your notification preferences",
    category: "getting-started",
    content: `# Setting Up Notifications

Stay informed about important events with customizable notifications.

## Accessing Notification Settings

1. Click your avatar in the top right
2. Select "Notification Preferences"

## Notification Types

### Revenue Alerts
- Large tips received
- Revenue milestones hit
- Subscription renewals

### Fan Engagement
- Whale inactivity warnings
- Churn risk alerts
- New VIP fans

### Chatter Performance
- Low conversion alerts
- Shift reminders

### System Alerts
- System updates
- Maintenance windows
- Error notifications

## Alert Thresholds

Customize when you get notified:
- Minimum tip amount for alerts
- Fan tiers to monitor
- Message volume thresholds

## Quiet Hours

Enable "Do Not Disturb" during specific hours to avoid late-night alerts.

## Notification Channels

Currently:
- ✅ In-App notifications
- 🔜 Email (coming soon)
- 🔜 Push notifications (coming soon)
- 🔜 SMS (coming soon)`,
    lastUpdated: new Date(),
    tags: ["notifications", "settings", "alerts", "preferences"],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Navigate faster with keyboard commands",
    category: "getting-started",
    content: `# Keyboard Shortcuts

Use keyboard shortcuts to navigate the CRM faster.

## Opening the Shortcuts Menu

Press **?** or **⌘K** to view all available shortcuts.

## Navigation Shortcuts

- **G then H**: Go to Home/Overview
- **G then C**: Go to Creators
- **G then F**: Go to Fans
- **G then R**: Go to Revenue
- **G then M**: Go to Chatters

## Action Shortcuts

- **⌘N**: Create new (context-aware)
- **⌘S**: Save (in forms)
- **⌘/**: Focus search
- **Esc**: Close modal or dialog

## Interface Shortcuts

- **⌘K**: Open command palette
- **⌘B**: Toggle sidebar
- **⌘.**: Open settings

## Table Navigation

- **↑ ↓**: Navigate rows
- **Enter**: Open selected item
- **Space**: Select/deselect row

## Platform Differences

- **Mac**: Use ⌘ (Command)
- **Windows/Linux**: Use Ctrl`,
    lastUpdated: new Date(),
    tags: ["shortcuts", "keyboard", "navigation", "productivity"],
  },
  {
    id: "troubleshooting-404",
    title: "Troubleshooting Page Not Found Errors",
    description: "Fix common 404 and navigation issues",
    category: "troubleshooting",
    content: `# Troubleshooting Page Not Found Errors

If you're seeing 404 errors or pages aren't loading, try these solutions.

## Common Causes

1. **Stale Browser Cache**: Clear your cache and reload
2. **Incorrect URL**: Check the address bar for typos
3. **Outdated Bookmark**: Update your bookmarks to current URLs
4. **Server Issues**: Check system status

## Solutions

### Clear Browser Cache
1. Press ⌘Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
2. Select "Cached images and files"
3. Click "Clear data"
4. Reload the page

### Hard Refresh
- **Mac**: ⌘Shift+R
- **Windows**: Ctrl+F5

### Check URL Structure
Valid URLs:
- /creators
- /fans
- /revenue
- /chatters
- /settings/profile

### Still Having Issues?

Contact support with:
- The URL you're trying to access
- Screenshot of the error
- Browser and version`,
    lastUpdated: new Date(),
    tags: ["troubleshooting", "404", "errors", "support"],
  },
];

// Search function
export function searchHelpArticles(query: string): HelpArticle[] {
  if (!query.trim()) return HELP_ARTICLES;

  const lowerQuery = query.toLowerCase();
  return HELP_ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get articles by category
export function getArticlesByCategory(categoryId: string): HelpArticle[] {
  return HELP_ARTICLES.filter((article) => article.category === categoryId);
}

// Get single article
export function getArticleById(id: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.id === id);
}
