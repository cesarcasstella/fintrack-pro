#!/bin/bash
# FinTrack Pro - GitHub Setup Script
# Run this script after installing and authenticating gh CLI
# Install: https://cli.github.com/
# Auth: gh auth login

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   FinTrack Pro - GitHub Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ gh CLI is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ gh CLI is not authenticated${NC}"
    echo "Run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ gh CLI is installed and authenticated${NC}"
echo ""

# ==============================================
# CREATE LABELS
# ==============================================
echo -e "${YELLOW}Creating labels...${NC}"

# Priority Labels
gh label create "P0-critical" --color "B60205" --description "Must have for MVP" --force 2>/dev/null || true
gh label create "P1-high" --color "D93F0B" --description "Should have" --force 2>/dev/null || true
gh label create "P2-medium" --color "FBCA04" --description "Nice to have" --force 2>/dev/null || true
gh label create "P3-low" --color "0E8A16" --description "Future consideration" --force 2>/dev/null || true

# Type Labels
gh label create "type:feature" --color "1D76DB" --description "New functionality" --force 2>/dev/null || true
gh label create "type:bug" --color "B60205" --description "Bug fix" --force 2>/dev/null || true
gh label create "type:chore" --color "6A737D" --description "Maintenance" --force 2>/dev/null || true
gh label create "type:docs" --color "5319E7" --description "Documentation" --force 2>/dev/null || true
gh label create "type:security" --color "D73A49" --description "Security related" --force 2>/dev/null || true

# Area Labels
gh label create "area:frontend" --color "0E8A16" --description "UI/UX" --force 2>/dev/null || true
gh label create "area:backend" --color "006B75" --description "API/Database" --force 2>/dev/null || true
gh label create "area:whatsapp" --color "25D366" --description "WhatsApp integration" --force 2>/dev/null || true
gh label create "area:devops" --color "F9A825" --description "CI/CD, infrastructure" --force 2>/dev/null || true
gh label create "area:mobile" --color "0366D6" --description "PWA/Native apps" --force 2>/dev/null || true

# Status Labels
gh label create "status:blocked" --color "B60205" --description "Blocked by dependency" --force 2>/dev/null || true
gh label create "status:in-progress" --color "FBCA04" --description "Currently working" --force 2>/dev/null || true
gh label create "status:review" --color "5319E7" --description "Ready for review" --force 2>/dev/null || true
gh label create "status:ready" --color "0E8A16" --description "Ready for development" --force 2>/dev/null || true

# PRD Alignment Labels
gh label create "prd:dashboard" --color "C5DEF5" --description "Dashboard features" --force 2>/dev/null || true
gh label create "prd:transactions" --color "C5DEF5" --description "Transaction management" --force 2>/dev/null || true
gh label create "prd:projections" --color "C5DEF5" --description "Financial projections" --force 2>/dev/null || true
gh label create "prd:simulator" --color "C5DEF5" --description "What-If simulator" --force 2>/dev/null || true
gh label create "prd:whatsapp" --color "C5DEF5" --description "WhatsApp integration" --force 2>/dev/null || true
gh label create "prd:b2b" --color "C5DEF5" --description "White-label/B2B features" --force 2>/dev/null || true

echo -e "${GREEN}✓ Labels created${NC}"

# ==============================================
# CREATE MILESTONES
# ==============================================
echo -e "${YELLOW}Creating milestones...${NC}"

# Calculate due dates (14, 28, 42, 90 days from now)
DATE_MVP=$(date -d "+14 days" +%Y-%m-%d 2>/dev/null || date -v+14d +%Y-%m-%d)
DATE_ADVANCED=$(date -d "+28 days" +%Y-%m-%d 2>/dev/null || date -v+28d +%Y-%m-%d)
DATE_POLISH=$(date -d "+42 days" +%Y-%m-%d 2>/dev/null || date -v+42d +%Y-%m-%d)
DATE_GROWTH=$(date -d "+90 days" +%Y-%m-%d 2>/dev/null || date -v+90d +%Y-%m-%d)

gh api repos/:owner/:repo/milestones --method POST -f title="MVP Core" -f due_on="${DATE_MVP}T00:00:00Z" -f description="Deploy functional PWA with core features" 2>/dev/null || echo "Milestone MVP Core may already exist"
gh api repos/:owner/:repo/milestones --method POST -f title="Advanced Features" -f due_on="${DATE_ADVANCED}T00:00:00Z" -f description="Projections, simulator, and WhatsApp" 2>/dev/null || echo "Milestone Advanced Features may already exist"
gh api repos/:owner/:repo/milestones --method POST -f title="Polish & Launch" -f due_on="${DATE_POLISH}T00:00:00Z" -f description="Production-ready with mobile apps" 2>/dev/null || echo "Milestone Polish & Launch may already exist"
gh api repos/:owner/:repo/milestones --method POST -f title="Growth" -f due_on="${DATE_GROWTH}T00:00:00Z" -f description="Scale to 10K MAU" 2>/dev/null || echo "Milestone Growth may already exist"

echo -e "${GREEN}✓ Milestones created${NC}"

# ==============================================
# CREATE ISSUES - MILESTONE 1: MVP CORE
# ==============================================
echo -e "${YELLOW}Creating Milestone 1 issues...${NC}"

# Issue 1: Setup Next.js project
gh issue create \
  --title "[SETUP] Initialize Next.js 14 project with TypeScript" \
  --body "## Description
Setup Next.js 14 project with App Router and TypeScript configuration.

## Tasks
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Setup path aliases
- [ ] Configure next.config.js for PWA

## Acceptance Criteria
- Project runs with \`npm run dev\`
- TypeScript strict mode enabled
- ESLint passes with no errors" \
  --label "P0-critical,type:chore,area:frontend" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 2: Configure Tailwind + shadcn/ui
gh issue create \
  --title "[SETUP] Configure Tailwind CSS + shadcn/ui" \
  --body "## Description
Install and configure Tailwind CSS with shadcn/ui component library.

## Tasks
- [ ] Install Tailwind CSS
- [ ] Configure theme colors for FinTrack brand
- [ ] Install shadcn/ui components (button, input, card, etc.)
- [ ] Create base component variants

## Acceptance Criteria
- Tailwind classes work
- shadcn components render correctly
- Dark mode support ready" \
  --label "P0-critical,type:chore,area:frontend" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 3: Setup Database
gh issue create \
  --title "[SETUP] Setup Neon PostgreSQL + Drizzle ORM" \
  --body "## Description
Configure database connection and ORM for the application.

## Tasks
- [ ] Create Neon project and database
- [ ] Install Drizzle ORM
- [ ] Configure connection pooling
- [ ] Setup Drizzle Kit for migrations

## Acceptance Criteria
- Can connect to database
- Drizzle studio works
- Migrations run successfully" \
  --label "P0-critical,type:chore,area:backend" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 4: Implement authentication
gh issue create \
  --title "[FEATURE] Implement authentication with NextAuth.js" \
  --body "## Description
Setup authentication system with email/password login.

## User Story
**As a** user
**I want** to create an account and log in
**So that** I can access my personal financial data

## Tasks
- [ ] Install NextAuth.js
- [ ] Configure email/password provider
- [ ] Create login page
- [ ] Create signup page
- [ ] Setup auth middleware
- [ ] Add session management

## Acceptance Criteria
- Users can register with email/password
- Users can log in and log out
- Protected routes require authentication
- Session persists across page refreshes" \
  --label "P0-critical,type:feature,area:backend" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 5: Create database schema
gh issue create \
  --title "[FEATURE] Create database schema and migrations" \
  --body "## Description
Design and implement the core database schema.

## Tables
- users/profiles
- accounts (checking, savings, credit, cash)
- categories (income/expense with icons)
- transactions
- recurring_rules
- whatsapp_messages

## Tasks
- [ ] Design schema in Drizzle
- [ ] Create initial migration
- [ ] Add indexes for common queries
- [ ] Seed default categories

## Acceptance Criteria
- All tables created
- Foreign keys properly configured
- Default categories seeded" \
  --label "P0-critical,type:feature,area:backend,prd:transactions" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 6: Build dashboard layout
gh issue create \
  --title "[FEATURE] Build dashboard layout with sidebar navigation" \
  --body "## Description
Create the main dashboard layout with responsive sidebar.

## User Story
**As a** user
**I want** a clean dashboard layout
**So that** I can navigate easily between features

## Tasks
- [ ] Create sidebar component with navigation links
- [ ] Build header with user menu
- [ ] Implement responsive layout (mobile hamburger menu)
- [ ] Add page transitions

## Pages in Sidebar
- Dashboard (home)
- Transactions
- Accounts
- Categories
- Projections
- Simulator
- Settings

## Acceptance Criteria
- Sidebar collapses on mobile
- Current page is highlighted
- User can log out from header" \
  --label "P0-critical,type:feature,area:frontend,prd:dashboard" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 7: Implement KPI cards
gh issue create \
  --title "[FEATURE] Implement 6 KPI dashboard cards" \
  --body "## Description
Create the main dashboard with 6 KPI cards showing financial summary.

## KPI Cards
1. **Total Balance** - Sum of all accounts
2. **Income This Month** - Total income for current month
3. **Expenses This Month** - Total expenses for current month
4. **Savings Rate** - (Income - Expenses) / Income %
5. **Top Category** - Highest expense category
6. **Trend** - Comparison with previous month

## Tasks
- [ ] Create KPI card component
- [ ] Implement balance calculation
- [ ] Implement income/expense aggregation
- [ ] Add trend indicators (up/down arrows)
- [ ] Add loading states

## Acceptance Criteria
- All 6 KPIs display correctly
- Data updates when transactions change
- Loading states while fetching" \
  --label "P0-critical,type:feature,area:frontend,prd:dashboard" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 8: Build transaction CRUD
gh issue create \
  --title "[FEATURE] Build transaction CRUD operations" \
  --body "## Description
Implement full CRUD for transactions (income/expenses).

## User Story
**As a** user
**I want** to add, edit, and delete transactions
**So that** I can track my income and expenses

## Features
- Transaction list with filters
- Add new transaction form
- Edit transaction
- Delete with confirmation
- Filter by date range, category, type

## Tasks
- [ ] Create transaction list page
- [ ] Build transaction form (add/edit)
- [ ] Implement API routes (GET, POST, PUT, DELETE)
- [ ] Add pagination
- [ ] Add search and filters
- [ ] Add delete confirmation modal

## Acceptance Criteria
- Can create income and expense transactions
- Can edit existing transactions
- Can delete transactions
- Filters work correctly
- Form validation prevents invalid data" \
  --label "P0-critical,type:feature,area:frontend,area:backend,prd:transactions" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 9: Implement category management
gh issue create \
  --title "[FEATURE] Implement category management" \
  --body "## Description
Allow users to view and manage transaction categories.

## User Story
**As a** user
**I want** to organize my transactions into categories
**So that** I can understand my spending patterns

## Features
- List of categories with icons
- Create custom categories
- Edit category (name, icon, color)
- Delete category (if no transactions)
- Set budget limits

## Default Categories (Seeded)
Income: Salario, Freelance, Inversiones, Otros
Expense: Alimentacion, Transporte, Vivienda, Servicios, Entretenimiento, Salud, Educacion, Compras, Otros

## Tasks
- [ ] Create categories list page
- [ ] Build category form
- [ ] Implement icon picker
- [ ] Implement color picker
- [ ] Add budget limit field

## Acceptance Criteria
- Can create custom categories
- Can edit categories
- System categories cannot be deleted
- Icons display correctly" \
  --label "P0-critical,type:feature,area:frontend,prd:transactions" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 10: Build account management
gh issue create \
  --title "[FEATURE] Build account management" \
  --body "## Description
Allow users to manage their financial accounts.

## User Story
**As a** user
**I want** to track multiple accounts
**So that** I can see balances across all my money

## Account Types
- Checking (cuenta corriente)
- Savings (ahorros)
- Credit Card (tarjeta de credito)
- Cash (efectivo)

## Features
- List accounts with balances
- Add new account
- Edit account details
- Set initial balance
- Transfer between accounts

## Tasks
- [ ] Create accounts list page
- [ ] Build account form
- [ ] Implement account type selector
- [ ] Calculate current balance from transactions
- [ ] Add transfer functionality

## Acceptance Criteria
- Can create accounts of different types
- Balances calculate correctly
- Can transfer between accounts" \
  --label "P0-critical,type:feature,area:frontend,prd:transactions" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

# Issue 11: Deploy to Vercel staging
gh issue create \
  --title "[DEVOPS] Deploy to Vercel staging environment" \
  --body "## Description
Setup Vercel project and deploy to staging.

## Tasks
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Setup staging domain
- [ ] Configure preview deployments

## Environment Variables
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

## Acceptance Criteria
- Staging deploys on push to develop
- Preview deploys on PR
- All features work on staging" \
  --label "P0-critical,type:chore,area:devops" \
  --milestone "MVP Core" 2>/dev/null || echo "Issue may already exist"

echo -e "${GREEN}✓ Milestone 1 issues created${NC}"

# ==============================================
# CREATE ISSUES - MILESTONE 2: ADVANCED FEATURES
# ==============================================
echo -e "${YELLOW}Creating Milestone 2 issues...${NC}"

gh issue create --title "[FEATURE] Build 12-month projection engine" --body "Implement financial projection calculations for 12 months ahead based on recurring transactions and historical data." --label "P1-high,type:feature,area:backend,prd:projections" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Create projection visualization with Recharts" --body "Build interactive charts showing 12-month financial projections." --label "P1-high,type:feature,area:frontend,prd:projections" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Implement What-If simulator" --body "Build simulator that allows users to model financial scenarios." --label "P1-high,type:feature,area:frontend,prd:simulator" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Build NLP parser for simulator" --body "Implement natural language processing for simulator queries using Claude Haiku." --label "P1-high,type:feature,area:backend,prd:simulator" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[SETUP] Setup Twilio WhatsApp sandbox" --body "Configure Twilio account and WhatsApp sandbox for development." --label "P1-high,type:chore,area:whatsapp,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Create WhatsApp webhook endpoint" --body "Implement webhook to receive and respond to WhatsApp messages." --label "P1-high,type:feature,area:backend,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Implement WhatsApp message parser" --body "Parse WhatsApp messages to extract transaction data using Claude Haiku." --label "P1-high,type:feature,area:backend,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Build WhatsApp transaction logging" --body "Log transactions created via WhatsApp with source tracking." --label "P1-high,type:feature,area:backend,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Implement WhatsApp balance/category queries" --body "Allow users to query balance and category summaries via WhatsApp." --label "P1-high,type:feature,area:backend,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

gh issue create --title "[FEATURE] Create outbound WhatsApp notification system" --body "Send proactive notifications for budget alerts and reminders." --label "P1-high,type:feature,area:backend,prd:whatsapp" --milestone "Advanced Features" 2>/dev/null || true

echo -e "${GREEN}✓ Milestone 2 issues created${NC}"

# ==============================================
# CREATE ISSUES - MILESTONE 3: POLISH & LAUNCH
# ==============================================
echo -e "${YELLOW}Creating Milestone 3 issues...${NC}"

gh issue create --title "[FEATURE] Configure PWA manifest" --body "Setup PWA manifest for installable app experience." --label "P1-high,type:feature,area:frontend,area:mobile" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[FEATURE] Implement service worker" --body "Add service worker for offline support and caching." --label "P1-high,type:feature,area:frontend,area:mobile" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[CHORE] Optimize performance (Lighthouse >90)" --body "Achieve Lighthouse score >90 in all categories." --label "P1-high,type:chore,area:frontend" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[SETUP] Setup Natively.dev for mobile apps" --body "Configure Natively.dev to generate iOS and Android apps from PWA." --label "P1-high,type:chore,area:mobile" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[FEATURE] Create landing page (Spanish)" --body "Build marketing landing page in Spanish for LATAM market." --label "P1-high,type:feature,area:frontend" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[DOCS] Write documentation" --body "Complete all documentation for users and developers." --label "P1-high,type:docs" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[DEVOPS] Setup monitoring and alerts" --body "Configure Sentry, PostHog, and Slack alerts." --label "P1-high,type:chore,area:devops" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[DEVOPS] Production deployment" --body "Deploy to production with custom domain and SSL." --label "P0-critical,type:chore,area:devops" --milestone "Polish & Launch" 2>/dev/null || true

gh issue create --title "[CHORE] App Store submissions" --body "Submit iOS and Android apps to respective stores." --label "P1-high,type:chore,area:mobile" --milestone "Polish & Launch" 2>/dev/null || true

echo -e "${GREEN}✓ Milestone 3 issues created${NC}"

# ==============================================
# CREATE ISSUES - MILESTONE 4: GROWTH
# ==============================================
echo -e "${YELLOW}Creating Milestone 4 issues...${NC}"

gh issue create --title "[FEATURE] Implement referral system" --body "Build referral system to drive user growth." --label "P2-medium,type:feature,prd:b2b" --milestone "Growth" 2>/dev/null || true

gh issue create --title "[FEATURE] Add gamification features" --body "Add badges, streaks, and achievements for engagement." --label "P2-medium,type:feature" --milestone "Growth" 2>/dev/null || true

gh issue create --title "[FEATURE] Build admin dashboard" --body "Create admin panel for user management and analytics." --label "P2-medium,type:feature,prd:b2b" --milestone "Growth" 2>/dev/null || true

gh issue create --title "[FEATURE] Create B2B white-label configuration" --body "Enable white-labeling for B2B customers." --label "P2-medium,type:feature,prd:b2b" --milestone "Growth" 2>/dev/null || true

gh issue create --title "[FEATURE] Integrate analytics (PostHog/Mixpanel)" --body "Setup product analytics for user behavior tracking." --label "P2-medium,type:feature,area:devops" --milestone "Growth" 2>/dev/null || true

echo -e "${GREEN}✓ Milestone 4 issues created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ GitHub setup complete!${NC}"
echo ""
echo "Created:"
echo "  - 24 labels (priority, type, area, status, PRD)"
echo "  - 4 milestones (MVP Core, Advanced Features, Polish & Launch, Growth)"
echo "  - 35 issues across all milestones"
echo ""
echo "View your project board at:"
echo "  https://github.com/cesarcasstella/fintrack-pro/issues"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
