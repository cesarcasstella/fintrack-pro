#!/bin/bash
# FinTrack Pro - Production Health Check Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_URL="${APP_URL:-https://fintrack.app}"
TIMEOUT="${TIMEOUT:-10}"
MAX_RETRIES="${MAX_RETRIES:-3}"

# Health check results
HEALTH_STATUS="healthy"
ISSUES=()

echo "🏥 Running FinTrack Pro health checks..."

# Check HTTP endpoint
check_http() {
    local endpoint="$1"
    local name="$2"

    echo -n "  Checking $name... "

    for i in $(seq 1 $MAX_RETRIES); do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "${APP_URL}${endpoint}" 2>/dev/null)

        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}OK${NC}"
            return 0
        fi

        if [ $i -lt $MAX_RETRIES ]; then
            sleep 2
        fi
    done

    echo -e "${RED}FAILED (HTTP $HTTP_CODE)${NC}"
    ISSUES+=("$name returned HTTP $HTTP_CODE")
    HEALTH_STATUS="unhealthy"
    return 1
}

# Check API health endpoint
check_api_health() {
    echo -n "  Checking API health... "

    RESPONSE=$(curl -s --connect-timeout $TIMEOUT "${APP_URL}/api/health" 2>/dev/null)

    if echo "$RESPONSE" | grep -q '"status":"healthy"'; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        ISSUES+=("API health check failed")
        HEALTH_STATUS="unhealthy"
        return 1
    fi
}

# Check database connectivity (via API)
check_database() {
    echo -n "  Checking database... "

    RESPONSE=$(curl -s --connect-timeout $TIMEOUT "${APP_URL}/api/health" 2>/dev/null)

    if echo "$RESPONSE" | grep -q '"database":"connected"'; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        ISSUES+=("Database connection failed")
        HEALTH_STATUS="unhealthy"
        return 1
    fi
}

# Check response time
check_response_time() {
    echo -n "  Checking response time... "

    START_TIME=$(date +%s%N)
    curl -s -o /dev/null --connect-timeout $TIMEOUT "${APP_URL}" 2>/dev/null
    END_TIME=$(date +%s%N)

    RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

    if [ $RESPONSE_TIME -lt 1000 ]; then
        echo -e "${GREEN}${RESPONSE_TIME}ms${NC}"
        return 0
    elif [ $RESPONSE_TIME -lt 3000 ]; then
        echo -e "${YELLOW}${RESPONSE_TIME}ms (slow)${NC}"
        ISSUES+=("Response time is slow: ${RESPONSE_TIME}ms")
        return 0
    else
        echo -e "${RED}${RESPONSE_TIME}ms (critical)${NC}"
        ISSUES+=("Response time critical: ${RESPONSE_TIME}ms")
        HEALTH_STATUS="degraded"
        return 1
    fi
}

# Check SSL certificate
check_ssl() {
    echo -n "  Checking SSL certificate... "

    # Skip for localhost
    if [[ "$APP_URL" == *"localhost"* ]]; then
        echo -e "${YELLOW}SKIPPED (localhost)${NC}"
        return 0
    fi

    DOMAIN=$(echo "$APP_URL" | sed 's|https://||' | sed 's|/.*||')
    EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -z "$EXPIRY" ]; then
        echo -e "${RED}FAILED${NC}"
        ISSUES+=("Could not check SSL certificate")
        return 1
    fi

    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    if [ $DAYS_LEFT -gt 30 ]; then
        echo -e "${GREEN}OK (${DAYS_LEFT} days)${NC}"
        return 0
    elif [ $DAYS_LEFT -gt 7 ]; then
        echo -e "${YELLOW}WARNING (${DAYS_LEFT} days)${NC}"
        ISSUES+=("SSL certificate expires in $DAYS_LEFT days")
        return 0
    else
        echo -e "${RED}CRITICAL (${DAYS_LEFT} days)${NC}"
        ISSUES+=("SSL certificate expires in $DAYS_LEFT days")
        HEALTH_STATUS="critical"
        return 1
    fi
}

# Main
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   FinTrack Pro - Health Check"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Target: $APP_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo ""
    echo "Running checks:"

    check_http "/" "Homepage"
    check_api_health
    check_database
    check_response_time
    check_ssl

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo -e "${GREEN}✅ All checks passed - System is healthy${NC}"
        exit 0
    elif [ "$HEALTH_STATUS" = "degraded" ]; then
        echo -e "${YELLOW}⚠️  System is degraded${NC}"
        echo ""
        echo "Issues:"
        for issue in "${ISSUES[@]}"; do
            echo "  - $issue"
        done
        exit 1
    else
        echo -e "${RED}❌ System is unhealthy${NC}"
        echo ""
        echo "Issues:"
        for issue in "${ISSUES[@]}"; do
            echo "  - $issue"
        done
        exit 2
    fi
}

main
