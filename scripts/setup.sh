#!/bin/bash
# FinTrack Pro - Local Development Setup Script

set -e

echo "🚀 Setting up FinTrack Pro development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 20+${NC}"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version must be 18 or higher. Current: $(node -v)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
}

# Check npm
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"
}

# Install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Setup environment file
setup_env() {
    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            cp .env.example .env.local
            echo -e "${GREEN}✓ Created .env.local from .env.example${NC}"
            echo -e "${YELLOW}⚠️  Please edit .env.local with your configuration${NC}"
        else
            echo -e "${YELLOW}⚠️  No .env.example found. Please create .env.local manually${NC}"
        fi
    else
        echo -e "${GREEN}✓ .env.local already exists${NC}"
    fi
}

# Setup git hooks
setup_hooks() {
    echo -e "${YELLOW}🔧 Setting up git hooks...${NC}"

    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint --silent
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix errors before committing."
    exit 1
fi

# Run type check
npm run type-check --silent
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix errors before committing."
    exit 1
fi

echo "✓ Pre-commit checks passed"
EOF
    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✓ Git hooks configured${NC}"
}

# Check database connection
check_db() {
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}⚠️  DATABASE_URL not set. Database connection not verified.${NC}"
    else
        echo -e "${YELLOW}🔍 Checking database connection...${NC}"
        # Add database check logic here if needed
    fi
}

# Main setup flow
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   FinTrack Pro - Development Setup"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    check_node
    check_npm
    install_deps
    setup_env
    setup_hooks
    check_db

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Edit .env.local with your configuration"
    echo "  2. Run: npm run dev"
    echo "  3. Open: http://localhost:3000"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

main
