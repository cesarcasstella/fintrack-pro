# FinTrack Pro - Technical Architecture

## Overview

FinTrack Pro utiliza una arquitectura moderna serverless-first, optimizada para el ecosistema Vercel y diseñada para escalar a miles de usuarios.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │   PWA    │  │  Mobile  │  │  Landing │  │     WhatsApp     ││
│  │  (Next)  │  │(Natively)│  │   Page   │  │   (Twilio API)   ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘│
│       │             │             │                  │          │
└───────┼─────────────┼─────────────┼──────────────────┼──────────┘
        │             │             │                  │
        └─────────────┴──────┬──────┴──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                         EDGE/CDN                                │
├────────────────────────────┼────────────────────────────────────┤
│  ┌─────────────────────────┴─────────────────────────────────┐ │
│  │                    Vercel Edge Network                     │ │
│  │  • Static Assets (ISR)                                     │ │
│  │  • Edge Middleware (Auth, Rate Limiting)                   │ │
│  │  • Edge Functions (Lightweight processing)                 │ │
│  └─────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├────────────────────────────┼────────────────────────────────────┤
│  ┌─────────────────────────┴─────────────────────────────────┐ │
│  │                  Next.js App Router                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  API Routes:                                               │ │
│  │  ├── /api/auth/*        (Authentication)                  │ │
│  │  ├── /api/transactions  (CRUD Operations)                 │ │
│  │  ├── /api/accounts      (Account Management)              │ │
│  │  ├── /api/dashboard     (KPI Aggregations)                │ │
│  │  ├── /api/projections   (Financial Projections)           │ │
│  │  ├── /api/simulator     (What-If Scenarios)               │ │
│  │  └── /api/webhooks/*    (WhatsApp, Stripe)                │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                       DATA LAYER                                │
├────────────────────────────┼────────────────────────────────────┤
│  ┌───────────────┐  ┌──────┴──────┐  ┌────────────────────────┐│
│  │    Neon DB    │  │   Drizzle   │  │       Supabase         ││
│  │  (PostgreSQL) │◄─┤     ORM     │  │    (Auth/Storage)      ││
│  └───────────────┘  └─────────────┘  └────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├────────────────────────────┼────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │  Twilio  │  │ Anthropic│  │  Posthog │  │      Sentry      ││
│  │ WhatsApp │  │ (Claude) │  │Analytics │  │  Error Tracking  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework | 14.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| shadcn/ui | UI Components | Latest |
| Recharts | Charts/Graphs | 2.x |
| React Hook Form | Form Handling | 7.x |
| Zod | Validation | 3.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | REST API | 14.x |
| Drizzle ORM | Database ORM | Latest |
| NextAuth.js | Authentication | 4.x |

### Database
| Technology | Purpose |
|------------|---------|
| Neon PostgreSQL | Primary Database |
| Drizzle Kit | Migrations |

### External Services
| Service | Purpose |
|---------|---------|
| Twilio | WhatsApp API |
| Anthropic Claude | NLP Parsing |
| Vercel | Hosting/Edge |
| Natively.dev | PWA to Native |

## Database Schema

```sql
-- Core Tables
Users
├── id (UUID, PK)
├── email (unique)
├── name
├── phone
├── whatsapp_verified
├── created_at
└── updated_at

Accounts
├── id (UUID, PK)
├── user_id (FK -> Users)
├── name
├── type (checking, savings, credit, cash)
├── balance
├── currency
├── is_active
└── created_at

Categories
├── id (UUID, PK)
├── user_id (FK -> Users)
├── name
├── type (income, expense)
├── icon
├── color
├── budget_limit
└── is_system

Transactions
├── id (UUID, PK)
├── user_id (FK -> Users)
├── account_id (FK -> Accounts)
├── category_id (FK -> Categories)
├── type (income, expense, transfer)
├── amount
├── description
├── date
├── source (web, whatsapp, api)
├── recurring_rule_id (FK, nullable)
└── created_at

RecurringRules
├── id (UUID, PK)
├── user_id (FK -> Users)
├── account_id (FK -> Accounts)
├── category_id (FK -> Categories)
├── type
├── amount
├── description
├── frequency (daily, weekly, monthly, yearly)
├── start_date
├── end_date
├── next_occurrence
└── is_active

WhatsAppMessages
├── id (UUID, PK)
├── user_id (FK -> Users)
├── message_sid
├── from_number
├── body
├── parsed_data (JSONB)
├── status
├── transaction_id (FK, nullable)
└── created_at
```

## API Design

### REST Endpoints

```
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session

Transactions
GET    /api/transactions          # List with filters
POST   /api/transactions          # Create
GET    /api/transactions/:id      # Get one
PUT    /api/transactions/:id      # Update
DELETE /api/transactions/:id      # Delete

Accounts
GET    /api/accounts
POST   /api/accounts
PUT    /api/accounts/:id
DELETE /api/accounts/:id

Categories
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

Dashboard
GET    /api/dashboard             # KPIs and summary

Projections
GET    /api/projections           # 12-month projection
POST   /api/projections/simulate  # What-if scenario

Webhooks
POST   /api/webhooks/whatsapp     # Twilio webhook
POST   /api/webhooks/stripe       # Stripe webhook (future)
```

### Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

## Security Architecture

### Authentication Flow
1. User logs in via email/password or OAuth
2. Server creates JWT session token
3. Token stored in httpOnly cookie
4. Middleware validates token on protected routes

### Security Measures
- HTTPS only
- CSRF protection
- Rate limiting (100 req/min per user)
- Input sanitization
- SQL injection prevention (ORM)
- XSS prevention (React + CSP)

### Data Protection
- Passwords hashed with bcrypt
- Sensitive data encrypted at rest
- PII anonymized in logs
- GDPR/LGPD compliant data handling

## Performance Optimization

### Caching Strategy
```
┌─────────────────────────────────────────┐
│            CACHE LAYERS                  │
├─────────────────────────────────────────┤
│  Browser Cache (Static Assets)   ~1 day │
│  Vercel Edge Cache (Pages)       ~1 hour│
│  Application Cache (React Query) ~5 min │
│  Database Query Cache            ~1 min │
└─────────────────────────────────────────┘
```

### Optimization Techniques
- Image optimization (next/image)
- Code splitting (dynamic imports)
- Tree shaking
- Database connection pooling
- Query optimization with indexes

## Monitoring & Observability

### Logging
- Structured JSON logs
- Request/Response logging
- Error stack traces
- Performance metrics

### Alerting
- Error rate > 1%
- Response time > 500ms
- Database connection failures
- External API failures

### Dashboards
- Real-time user metrics
- API performance
- Error tracking
- Business KPIs

## Deployment Architecture

### Environments
| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | feature/* | localhost:3000 | Local dev |
| Staging | develop | staging.fintrack.app | Testing |
| Production | main (tags) | fintrack.app | Live |

### CI/CD Pipeline
```
Code Push → Lint/Test → Build → Deploy Preview → Review → Merge → Deploy
```

## Scalability Considerations

### Current Architecture (0-10K users)
- Single database instance
- Vercel serverless functions
- Edge caching

### Future Scaling (10K-100K users)
- Read replicas
- Connection pooling
- Redis caching
- Queue processing (WhatsApp)

### Enterprise Scaling (100K+ users)
- Database sharding
- Regional deployments
- Dedicated infrastructure
