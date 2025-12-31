#!/bin/bash
# FinTrack Pro - Database Seeding Script

set -e

echo "🌱 Seeding FinTrack Pro database..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}Loading environment from .env.local...${NC}"
    if [ -f .env.local ]; then
        export $(grep -v '^#' .env.local | xargs)
    else
        echo -e "${RED}❌ No .env.local found and DATABASE_URL not set${NC}"
        exit 1
    fi
fi

# Seed categories
seed_categories() {
    echo -e "${YELLOW}📁 Seeding default categories...${NC}"

    npx tsx << 'EOF'
import { db } from './lib/db';
import { categories } from './lib/db/schema';

const defaultCategories = [
  // Income categories
  { name: 'Salario', type: 'income', icon: 'briefcase', color: '#10B981', isSystem: true },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#3B82F6', isSystem: true },
  { name: 'Inversiones', type: 'income', icon: 'trending-up', color: '#8B5CF6', isSystem: true },
  { name: 'Otros Ingresos', type: 'income', icon: 'plus-circle', color: '#6B7280', isSystem: true },

  // Expense categories
  { name: 'Alimentacion', type: 'expense', icon: 'utensils', color: '#EF4444', isSystem: true },
  { name: 'Transporte', type: 'expense', icon: 'car', color: '#F59E0B', isSystem: true },
  { name: 'Vivienda', type: 'expense', icon: 'home', color: '#6366F1', isSystem: true },
  { name: 'Servicios', type: 'expense', icon: 'zap', color: '#EC4899', isSystem: true },
  { name: 'Entretenimiento', type: 'expense', icon: 'film', color: '#14B8A6', isSystem: true },
  { name: 'Salud', type: 'expense', icon: 'heart', color: '#F43F5E', isSystem: true },
  { name: 'Educacion', type: 'expense', icon: 'book', color: '#0EA5E9', isSystem: true },
  { name: 'Compras', type: 'expense', icon: 'shopping-bag', color: '#A855F7', isSystem: true },
  { name: 'Otros Gastos', type: 'expense', icon: 'more-horizontal', color: '#6B7280', isSystem: true },
];

async function seed() {
  for (const category of defaultCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
  console.log('✓ Categories seeded');
}

seed().catch(console.error);
EOF

    echo -e "${GREEN}✓ Categories seeded${NC}"
}

# Seed sample data for development
seed_sample_data() {
    echo -e "${YELLOW}📊 Seeding sample data...${NC}"

    npx tsx << 'EOF'
import { db } from './lib/db';
import { users, accounts, transactions, categories } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedSampleData() {
  // Create demo user
  const [user] = await db.insert(users).values({
    email: 'demo@fintrack.app',
    name: 'Demo User',
  }).onConflictDoNothing().returning();

  if (!user) {
    console.log('Demo user already exists');
    return;
  }

  // Create accounts
  const [checking] = await db.insert(accounts).values({
    userId: user.id,
    name: 'Cuenta Corriente',
    type: 'checking',
    balance: 2500000,
    currency: 'COP',
  }).returning();

  const [savings] = await db.insert(accounts).values({
    userId: user.id,
    name: 'Ahorros',
    type: 'savings',
    balance: 5000000,
    currency: 'COP',
  }).returning();

  // Get categories
  const cats = await db.select().from(categories);
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  // Create sample transactions
  const now = new Date();
  const transactions = [
    { type: 'income', amount: 4500000, description: 'Salario Enero', categoryName: 'Salario', daysAgo: 30 },
    { type: 'expense', amount: 1200000, description: 'Arriendo', categoryName: 'Vivienda', daysAgo: 28 },
    { type: 'expense', amount: 250000, description: 'Mercado', categoryName: 'Alimentacion', daysAgo: 25 },
    { type: 'expense', amount: 150000, description: 'Servicios publicos', categoryName: 'Servicios', daysAgo: 20 },
    { type: 'expense', amount: 80000, description: 'Uber mensual', categoryName: 'Transporte', daysAgo: 15 },
    { type: 'expense', amount: 50000, description: 'Netflix + Spotify', categoryName: 'Entretenimiento', daysAgo: 10 },
    { type: 'expense', amount: 120000, description: 'Cena restaurante', categoryName: 'Alimentacion', daysAgo: 5 },
    { type: 'income', amount: 4500000, description: 'Salario Febrero', categoryName: 'Salario', daysAgo: 0 },
  ];

  for (const tx of transactions) {
    const date = new Date(now);
    date.setDate(date.getDate() - tx.daysAgo);

    await db.insert(transactions).values({
      userId: user.id,
      accountId: checking.id,
      categoryId: catMap[tx.categoryName],
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      date: date,
      source: 'seed',
    });
  }

  console.log('✓ Sample data seeded');
}

seedSampleData().catch(console.error);
EOF

    echo -e "${GREEN}✓ Sample data seeded${NC}"
}

# Main
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   FinTrack Pro - Database Seeding"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    seed_categories

    if [ "$1" == "--with-sample" ]; then
        seed_sample_data
    fi

    echo ""
    echo -e "${GREEN}✅ Database seeding complete!${NC}"
    echo ""
}

main "$@"
