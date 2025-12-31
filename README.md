# FinTrack Pro

> Aplicacion de finanzas personales con integracion WhatsApp para LATAM

[![CI](https://github.com/cesarcasstella/fintrack-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/cesarcasstella/fintrack-pro/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://fintrack-pro.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Vision del Producto

FinTrack Pro permite a usuarios latinoamericanos:
- Registrar gastos via **WhatsApp** en segundos
- Ver **proyecciones financieras a 12 meses**
- Simular escenarios con **"Que pasaria si..."**
- Usar como **PWA instalable** en cualquier dispositivo

## Quick Start

```bash
# Clone
git clone https://github.com/cesarcasstella/fintrack-pro.git
cd fintrack-pro

# Install
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Database (if using Drizzle)
npm run db:push

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
fintrack-pro/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Sidebar, header
│   ├── transactions/     # Transaction components
│   └── ui/               # shadcn components
├── lib/                   # Utilities
│   ├── db/               # Database (Drizzle)
│   ├── supabase/         # Supabase clients
│   ├── whatsapp/         # WhatsApp parser & sender
│   └── utils/            # Helper functions
├── docs/                  # Documentation
│   ├── PRD.md            # Product Requirements
│   ├── ARCHITECTURE.md   # Technical design
│   ├── API.md            # API reference
│   └── ADR/              # Architecture Decision Records
├── scripts/              # Dev scripts
│   ├── setup.sh          # Local setup
│   ├── seed-db.sh        # Database seeding
│   └── health-check.sh   # Production checks
├── types/                # TypeScript types
└── middleware.ts         # Auth middleware
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Recharts |
| Database | Neon PostgreSQL / Supabase |
| ORM | Drizzle |
| Auth | Supabase Auth / NextAuth.js |
| WhatsApp | Twilio API |
| AI/NLP | Claude Haiku |
| Deploy | Vercel |
| Mobile | PWA + Natively.dev |

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [Architecture](docs/ARCHITECTURE.md) | Technical architecture |
| [API](docs/API.md) | API reference |
| [Deployment](docs/DEPLOYMENT.md) | Deploy guide |
| [Contributing](docs/CONTRIBUTING.md) | Contribution guidelines |
| [Changelog](docs/CHANGELOG.md) | Version history |

## PRD Milestones

| Milestone | Status | Target |
|-----------|--------|--------|
| MVP Core | In Progress | Week 2 |
| Advanced Features | Planned | Week 4 |
| Polish & Launch | Planned | Week 6 |
| Growth | Future | Month 3 |

## KPIs (PRD Targets)

| Metric | Target |
|--------|--------|
| MAU | 10,000 |
| WhatsApp Adoption | 60% |
| D7 Retention | 25% |
| B2B Clients | 3 |

## WhatsApp Integration

Send messages to register transactions:

| Message | Action |
|---------|--------|
| `Almuerzo 25000` | Creates expense |
| `Ingreso 1500000 salario` | Creates income |
| `Balance` | Returns balances |
| `Resumen` | Monthly summary |

### Setup Twilio Sandbox

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to Messaging > Try it out > Send a WhatsApp message
3. Follow instructions to join sandbox
4. Set webhook URL to: `https://your-domain.com/api/webhooks/whatsapp`

## Development

### Prerequisites

- Node.js 20+
- npm or pnpm
- PostgreSQL (or use Neon/Supabase)

### Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server

# Database
npm run db:push       # Push schema changes
npm run db:studio     # Open Drizzle Studio
npm run db:generate   # Generate migrations

# Testing
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run lint          # Lint code
npm run type-check    # TypeScript check

# Scripts
./scripts/setup.sh    # Initial setup
./scripts/seed-db.sh  # Seed database
```

### Docker

```bash
# Start all services
docker-compose up -d

# Start with additional tools
docker-compose --profile tools up -d

# View logs
docker-compose logs -f app
```

## Database Schema

Core tables:
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

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables

See [.env.example](.env.example) for all required variables.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit with conventional commits: `feat: add new feature`
3. Push and create PR to `develop`
4. After review, merge to `develop`
5. `develop` auto-deploys to staging

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactor
- `test:` Tests
- `chore:` Maintenance

## License

MIT - Cesar Castellanos

---

Built with Next.js, Tailwind CSS, and Supabase
