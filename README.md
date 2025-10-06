# VaultCRM

Professional CRM for OnlyFans creators and agencies - Powered by DataSync Dynamics.

## Features

- 📊 **Dashboard** - Real-time analytics and metrics
- 👥 **Fan Management** - Track and manage your subscriber base
- 💰 **Revenue Tracking** - Monitor earnings and financial metrics
- 💬 **Chatter Management** - Coordinate and monitor chat operators
- 📢 **Marketing Tools** - Campaign management and promotion
- 🔔 **Smart Alerts** - Real-time notifications and insights

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **UI Components:** Radix UI
- **Charts:** Recharts
- **State Management:** React Hooks
- **Real-time:** Supabase Realtime

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DataSyncDynamics/onlyfans-crm.git
cd onlyfans-crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /app                    # Next.js app router pages
    /(auth)              # Authentication pages
    /(dashboard)         # Dashboard pages
    /api                 # API routes
  /components            # React components
    /ui                  # Reusable UI components
    /dashboard           # Dashboard-specific components
    /layout              # Layout components
  /lib                   # Utility functions and configs
    /supabase            # Supabase client setup
  /types                 # TypeScript type definitions
  /hooks                 # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## License

MIT
