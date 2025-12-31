# ADR-001: Technology Stack Selection

## Status
Accepted

## Date
2024-01-01

## Context

We need to select a technology stack for FinTrack Pro, a personal finance application targeting the Latin American market. Key requirements:

1. **Mobile-first**: Primary usage on mobile devices
2. **Fast development**: Solo developer, need to ship MVP quickly
3. **Low operational cost**: Starting with minimal budget
4. **WhatsApp integration**: Core feature for LATAM market
5. **Scalability**: Ability to grow to 10K+ users

## Decision

### Frontend
**Next.js 14 with App Router**
- Server-side rendering for SEO and performance
- API routes eliminate need for separate backend
- React Server Components reduce client bundle
- Excellent TypeScript support

**Tailwind CSS + shadcn/ui**
- Rapid UI development
- Consistent design system
- Accessible components out of the box
- Easy customization

### Backend
**Next.js API Routes (Serverless)**
- No server management
- Pay-per-use pricing
- Auto-scaling
- Integrated with frontend

### Database
**Neon PostgreSQL** (or Supabase)
- Serverless PostgreSQL
- Generous free tier
- Scales to millions of rows
- SQL for complex financial queries

**Drizzle ORM**
- Type-safe queries
- Lightweight (vs Prisma)
- SQL-like syntax
- Easy migrations

### Authentication
**Supabase Auth** (or NextAuth.js)
- Email/password + OAuth
- Row Level Security for multi-tenancy
- Session management
- Free tier sufficient for MVP

### External Services
**Twilio WhatsApp API**
- Industry standard
- Reliable delivery
- Good documentation
- Sandbox for testing

**Anthropic Claude Haiku**
- Fast NLP processing
- Cost-effective
- Good Spanish support
- Simple API

### Hosting
**Vercel**
- Native Next.js support
- Global edge network
- Easy deployments
- Free tier for MVP

### Mobile
**PWA + Natively.dev**
- Single codebase
- App store presence
- Push notifications
- Offline support

## Alternatives Considered

### Frontend
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Next.js | Full-stack, SSR, ecosystem | Learning curve for App Router | **Selected** |
| Remix | Great DX, nested routes | Smaller ecosystem | Rejected |
| SvelteKit | Fast, simple | Smaller community | Rejected |
| React Native | True native | Separate codebase | Rejected |

### Database
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Neon | Serverless, branching | Newer service | **Selected** |
| Supabase | All-in-one, RLS | Can be overkill | Alternative |
| PlanetScale | MySQL, branching | MySQL vs PostgreSQL | Rejected |
| MongoDB | Flexible schema | Not ideal for financial data | Rejected |

### Hosting
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Vercel | Best Next.js support | Lock-in | **Selected** |
| Netlify | Good alternative | Slightly less Next.js optimization | Alternative |
| AWS Amplify | AWS ecosystem | More complex | Rejected |
| Self-hosted | Full control | Operational burden | Rejected |

## Consequences

### Positive
- Fast development with modern tools
- Low operational costs initially
- Good developer experience
- Easy to deploy and iterate
- Type safety throughout

### Negative
- Vendor lock-in (Vercel, Neon)
- Serverless cold starts possible
- Limited offline capabilities initially
- WhatsApp API costs at scale

### Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Vercel pricing increase | Medium | High | Can migrate to self-hosted |
| Neon downtime | Low | High | Backups, can migrate to Supabase |
| Twilio costs | High | Medium | Freemium model, usage limits |

## References
- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [shadcn/ui](https://ui.shadcn.com)
