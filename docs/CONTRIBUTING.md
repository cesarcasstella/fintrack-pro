# Contributing to FinTrack Pro

Gracias por tu interes en contribuir a FinTrack Pro. Este documento describe las guias y procesos para contribuir.

## Code of Conduct

- Se respetuoso y constructivo
- Acepta feedback de manera profesional
- Enfocate en lo que es mejor para el proyecto
- Muestra empatia hacia otros contribuidores

## Getting Started

### 1. Fork y Clone

```bash
# Fork via GitHub UI, luego:
git clone https://github.com/tu-usuario/fintrack-pro.git
cd fintrack-pro
git remote add upstream https://github.com/cesarcasstella/fintrack-pro.git
```

### 2. Setup Local

```bash
npm install
cp .env.example .env.local
# Configura tus variables de entorno
npm run dev
```

### 3. Crear Branch

```bash
# Sincronizar con upstream
git fetch upstream
git checkout develop
git merge upstream/develop

# Crear branch de feature
git checkout -b feature/nombre-descriptivo
```

## Git Workflow

### Branch Naming

```
feature/   - Nueva funcionalidad
fix/       - Correccion de bug
chore/     - Tareas de mantenimiento
docs/      - Documentacion
refactor/  - Refactorizacion de codigo
test/      - Agregar o modificar tests
```

**Ejemplos:**
- `feature/whatsapp-voice-messages`
- `fix/transaction-duplicate-bug`
- `docs/api-authentication`

### Commit Messages

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Documentacion
- `style`: Formateo (no afecta logica)
- `refactor`: Refactorizacion
- `test`: Tests
- `chore`: Mantenimiento

**Ejemplos:**
```bash
feat(whatsapp): add voice message parsing
fix(transactions): resolve duplicate entry bug
docs(api): update authentication section
refactor(dashboard): simplify KPI calculations
test(projections): add edge case tests
```

### Pull Requests

1. **Antes de crear PR:**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

2. **Crear PR:**
   - Base branch: `develop`
   - Usa el template de PR
   - Enlaza issues relacionados
   - Solicita review

3. **Checklist PR:**
   - [ ] Tests pasan localmente
   - [ ] Codigo sigue style guide
   - [ ] Documentacion actualizada
   - [ ] No hay console.logs
   - [ ] No hay secrets en codigo

## Code Style

### TypeScript

```typescript
// Usar tipos explicitos
function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Interfaces para objetos
interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
}

// Evitar any
// MAL:  const data: any = response.json();
// BIEN: const data: ApiResponse = response.json();
```

### React Components

```tsx
// Componentes funcionales con tipos
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button
      className={cn('btn', variant === 'primary' && 'btn-primary')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### File Structure

```
components/
├── ui/              # Componentes base (Button, Input, etc.)
├── layout/          # Layout components (Sidebar, Header)
├── transactions/    # Feature-specific components
└── shared/          # Componentes compartidos

lib/
├── db/              # Database utilities
├── utils/           # Helper functions
└── validations/     # Zod schemas

app/
├── (dashboard)/     # Dashboard routes (protected)
├── api/             # API routes
└── auth/            # Auth pages
```

### Naming Conventions

```typescript
// Archivos: kebab-case
transaction-list.tsx
use-transactions.ts

// Componentes: PascalCase
export function TransactionList() {}

// Hooks: camelCase con use prefix
export function useTransactions() {}

// Utilidades: camelCase
export function formatCurrency(amount: number) {}

// Constantes: UPPER_SNAKE_CASE
const MAX_TRANSACTIONS_PER_PAGE = 50;

// Types/Interfaces: PascalCase
interface TransactionFormData {}
type TransactionType = 'income' | 'expense';
```

## Testing

### Unit Tests

```typescript
// __tests__/utils/format.test.ts
import { formatCurrency } from '@/lib/utils/format';

describe('formatCurrency', () => {
  it('formats COP currency correctly', () => {
    expect(formatCurrency(1500000, 'COP')).toBe('$1.500.000');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'COP')).toBe('$0');
  });
});
```

### Component Tests

```typescript
// __tests__/components/transaction-card.test.tsx
import { render, screen } from '@testing-library/react';
import { TransactionCard } from '@/components/transactions/transaction-card';

describe('TransactionCard', () => {
  it('displays transaction details', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    expect(screen.getByText('$25.000')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Todos los tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Tests especificos
npm run test -- --grep "formatCurrency"
```

## API Development

### Route Handler Pattern

```typescript
// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTransaction } from '@/lib/db/transactions';
import { transactionSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Validation
    const body = await request.json();
    const validated = transactionSchema.parse(body);

    // 3. Business Logic
    const transaction = await createTransaction({
      ...validated,
      userId: session.user.id,
    });

    // 4. Response
    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error) {
    // 5. Error Handling
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 422 }
      );
    }
    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Database Changes

### Creating Migrations

```bash
# 1. Modify schema in lib/db/schema.ts
# 2. Generate migration
npm run db:generate

# 3. Review migration file
# 4. Apply migration
npm run db:push
```

### Schema Changes Checklist

- [ ] Schema updated in `lib/db/schema.ts`
- [ ] Types updated in `types/database.ts`
- [ ] Migration tested locally
- [ ] Seed data updated if needed
- [ ] API endpoints updated
- [ ] Frontend updated

## Documentation

### When to Update Docs

- Nueva API endpoint → `docs/API.md`
- Cambio de arquitectura → `docs/ARCHITECTURE.md`
- Nueva decision tecnica → `docs/ADR/xxx-decision.md`
- Nuevo proceso de deploy → `docs/DEPLOYMENT.md`

### ADR Format

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
Why we need to make this decision.

## Decision
What we decided to do.

## Consequences
Good and bad outcomes.
```

## Review Process

### Para Reviewers

1. Revisa que los tests pasen
2. Verifica que el codigo siga las convenciones
3. Prueba la funcionalidad localmente si es necesario
4. Deja comentarios constructivos
5. Aprueba cuando este listo

### Para Contribuidores

1. Responde a todos los comentarios
2. Haz los cambios solicitados
3. Re-request review despues de cambios
4. No hagas merge sin aprobacion

## Release Process

1. Features se mergean a `develop`
2. QA en ambiente staging
3. PR de `develop` a `main`
4. Crear tag de version
5. Deploy automatico a produccion

## Questions?

- Abre un issue con tag `question`
- Revisa issues existentes
- Lee la documentacion

## Recognition

Los contribuidores seran agregados al archivo CONTRIBUTORS.md.

Gracias por contribuir a FinTrack Pro.
