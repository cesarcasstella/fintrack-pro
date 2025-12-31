#!/bin/bash
# FinTrack Pro - Database Backup Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="fintrack_backup_${TIMESTAMP}.sql"

echo "💾 Starting FinTrack Pro database backup..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}Loading environment from .env.local...${NC}"
    if [ -f .env.local ]; then
        export $(grep -v '^#' .env.local | xargs)
    fi
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
create_backup() {
    echo -e "${YELLOW}📦 Creating backup...${NC}"

    # Check if pg_dump is available
    if ! command -v pg_dump &> /dev/null; then
        echo -e "${RED}❌ pg_dump not found. Install postgresql-client${NC}"
        exit 1
    fi

    # Create backup
    pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_FILE}"

    # Compress backup
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"

    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}.gz" | cut -f1)
    echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE}.gz (${BACKUP_SIZE})${NC}"
}

# Upload to S3 (optional)
upload_to_s3() {
    if [ -n "$AWS_S3_BUCKET" ]; then
        echo -e "${YELLOW}☁️  Uploading to S3...${NC}"

        if ! command -v aws &> /dev/null; then
            echo -e "${YELLOW}⚠️  AWS CLI not found. Skipping S3 upload.${NC}"
            return
        fi

        aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}.gz" "s3://${AWS_S3_BUCKET}/backups/${BACKUP_FILE}.gz"
        echo -e "${GREEN}✓ Uploaded to S3${NC}"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    echo -e "${YELLOW}🧹 Cleaning up old backups...${NC}"

    # Delete local backups older than retention period
    find "$BACKUP_DIR" -name "fintrack_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

    REMAINING=$(ls -1 "${BACKUP_DIR}"/fintrack_backup_*.sql.gz 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ Cleanup complete. ${REMAINING} backups remaining.${NC}"
}

# Verify backup
verify_backup() {
    echo -e "${YELLOW}🔍 Verifying backup...${NC}"

    # Check if file exists and is not empty
    if [ -s "${BACKUP_DIR}/${BACKUP_FILE}.gz" ]; then
        # Test gzip integrity
        if gzip -t "${BACKUP_DIR}/${BACKUP_FILE}.gz" 2>/dev/null; then
            echo -e "${GREEN}✓ Backup verified${NC}"
        else
            echo -e "${RED}❌ Backup file is corrupted${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Backup file is empty or missing${NC}"
        exit 1
    fi
}

# Main
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   FinTrack Pro - Database Backup"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Backup directory: $BACKUP_DIR"
    echo "Retention period: $RETENTION_DAYS days"
    echo ""

    create_backup
    verify_backup
    upload_to_s3
    cleanup_old_backups

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ Backup complete!${NC}"
    echo ""
    echo "Backup location: ${BACKUP_DIR}/${BACKUP_FILE}.gz"
    echo ""
}

main
