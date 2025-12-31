# ADR-002: Database Choice - Neon PostgreSQL

## Status
Accepted

## Date
2024-01-01

## Context

FinTrack Pro requires a database solution that can:

1. Store financial transactions with ACID compliance
2. Handle complex aggregations for dashboards
3. Support multi-tenancy (user isolation)
4. Scale from 0 to 10K+ users
5. Minimize operational overhead
6. Stay within budget constraints

## Decision

We will use **Neon PostgreSQL** as our primary database, with **Drizzle ORM** for database access.

### Why PostgreSQL?

1. **ACID Compliance**: Critical for financial data integrity
2. **Complex Queries**: Window functions, CTEs for projections
3. **JSON Support**: Flexible schema where needed
4. **Industry Standard**: Well-documented, battle-tested
5. **Rich Ecosystem**: Tools, extensions, expertise available

### Why Neon?

1. **Serverless**: Scales to zero, pay-per-use
2. **Branching**: Database branches for development/testing
3. **Free Tier**: Generous for MVP (3GB storage, 100 hours compute)
4. **Auto-scaling**: Handles traffic spikes
5. **Modern**: Built for cloud-native applications

### Why Drizzle ORM?

1. **Type Safety**: Full TypeScript support
2. **Performance**: Lightweight, no runtime overhead
3. **SQL-like**: Easy to understand and debug
4. **Migrations**: Simple migration system
5. **Relations**: Clean relation definitions

## Schema Design

```sql
-- Core entities with user isolation
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- checking, savings, credit, cash
  balance DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'COP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- income, expense
  icon TEXT,
  color TEXT,
  budget_limit DECIMAL(15,2),
  is_system BOOLEAN DEFAULT FALSE
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  category_id UUID REFERENCES categories(id),
  type TEXT NOT NULL, -- income, expense, transfer
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  source TEXT DEFAULT 'web', -- web, whatsapp, api
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_user_account ON transactions(user_id, account_id);
```

### Query Patterns

```sql
-- Dashboard aggregation
SELECT
  date_trunc('month', date) as month,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
FROM transactions
WHERE user_id = $1 AND date >= $2
GROUP BY date_trunc('month', date)
ORDER BY month;

-- Category breakdown
SELECT
  c.name,
  c.icon,
  SUM(t.amount) as total,
  COUNT(*) as count
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
  AND t.type = 'expense'
  AND t.date BETWEEN $2 AND $3
GROUP BY c.id
ORDER BY total DESC;
```

## Alternatives Considered

### Supabase
| Aspect | Supabase | Neon |
|--------|----------|------|
| PostgreSQL | Yes | Yes |
| Auth included | Yes | No |
| RLS built-in | Yes | Manual |
| Pricing | Per-project | Per-compute |
| Branching | No | Yes |
| **Decision** | Alternative | **Selected** |

Supabase is a valid alternative and may be used if we need built-in auth and RLS. Neon was chosen for its branching feature and simpler pricing model.

### PlanetScale
- MySQL instead of PostgreSQL
- No window functions (important for projections)
- Different query syntax
- **Rejected**: PostgreSQL better for financial data

### MongoDB
- Document database
- Flexible schema
- **Rejected**: ACID compliance concerns, complex aggregations harder

### SQLite (Turso)
- Serverless SQLite
- Edge-compatible
- **Rejected**: Less mature, limited for complex queries

## Consequences

### Positive
- Strong data integrity guarantees
- Efficient complex queries
- Low operational overhead
- Cost-effective for MVP
- Easy to migrate if needed

### Negative
- No built-in auth (need separate solution)
- Need to manage schema migrations
- Serverless cold starts possible
- Relatively new service (Neon)

### Migration Path
If Neon doesn't work out:
1. Export via pg_dump
2. Import to Supabase/RDS/any PostgreSQL
3. Update connection string
4. Minimal code changes (standard PostgreSQL)

## Implementation Notes

### Connection Pooling
```typescript
// Use connection pooling for serverless
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
```

### Drizzle Schema
```typescript
// lib/db/schema.ts
import { pgTable, uuid, text, decimal, timestamp } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  type: text('type').notNull(),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## References
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL for Financial Applications](https://www.postgresql.org/docs/current/tutorial.html)
