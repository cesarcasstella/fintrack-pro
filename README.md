# FinTrack Pro

Personal finance management app with WhatsApp integration, 12-month projections, and what-if simulator. Built for LATAM.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **WhatsApp**: Twilio API
- **Hosting**: Vercel

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local` and fill in your values:

```bash
# Supabase (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio (from twilio.com/console)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
fintrack-pro/
├── app/
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── auth/              # Auth pages (login, signup)
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Sidebar, header
│   ├── transactions/      # Transaction components
│   └── ui/                # shadcn components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── whatsapp/          # WhatsApp parser & sender
│   └── utils/             # Utility functions
├── types/
│   └── database.ts        # TypeScript types from schema
└── middleware.ts          # Auth middleware
```

## WhatsApp Integration

Users can send messages like:
- "Almuerzo 25000" → Creates expense
- "Ingreso 1500000 salario" → Creates income
- "Balance" → Returns account balances
- "Resumen" → Returns monthly summary

### Setup Twilio Sandbox

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to Messaging > Try it out > Send a WhatsApp message
3. Follow instructions to join sandbox
4. Set webhook URL to: `https://your-domain.com/api/webhooks/whatsapp`

## Database Schema

Run the SQL migration in Supabase SQL Editor to create:
- `profiles` - User profiles
- `accounts` - Financial accounts
- `categories` - Transaction categories
- `transactions` - Income/expenses
- `recurring_rules` - Recurring transactions
- `budgets` - Period-based budgets
- `projections_cache` - Cached projections
- `whatsapp_messages` - Message logs
- `audit_log` - B2B compliance

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Vercel

Add all variables from `.env.local` in Vercel dashboard under Settings > Environment Variables.

## License

Private - All rights reserved
