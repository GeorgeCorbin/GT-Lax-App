#!/bin/bash

# Script to simulate a new article and trigger notifications
# Usage: ./simulate-article.sh [API_KEY]

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   GT Lacrosse Article Simulator Tool   ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if API key is provided as argument or in .env.local
if [ -n "$1" ]; then
  API_KEY="$1"
  echo -e "${GREEN}Using API key from command line argument${NC}"
elif [ -f ".env.local" ]; then
  # Try to extract API key from .env.local file
  API_KEY=$(grep -E "^api_key=" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
  if [ -n "$API_KEY" ]; then
    echo -e "${GREEN}Using API key from .env.local file${NC}"
  fi
fi

# If API key is still not set, prompt for it
if [ -z "$API_KEY" ]; then
  echo -e "${YELLOW}API key not found. Please enter your API key:${NC}"
  read -s API_KEY
  if [ -z "$API_KEY" ]; then
    echo -e "${RED}No API key provided. Exiting.${NC}"
    exit 1
  fi
fi

# Generate a random article title
TITLES=(
  "Yellow Jackets Dominate in Season Opener"
  "GT Lacrosse Announces New Team Captain"
  "Tech Lacrosse Prepares for Championship Run"
  "Georgia Tech Defeats Rival in Overtime Thriller"
  "Lacrosse Team Welcomes New Assistant Coach"
  "GT Lax Ranked in Top 10 Nationally"
  "Yellow Jackets Set New School Record in Victory"
  "Tech's Defense Shines in Weekend Tournament"
  "Georgia Tech Announces Updated Practice Facility"
  "Lacrosse Team Volunteers at Local Community Event"
)

# Get a random title
RANDOM_INDEX=$((RANDOM % ${#TITLES[@]}))
TITLE="[SIMULATED] ${TITLES[$RANDOM_INDEX]}"

echo -e "${BLUE}Simulating new article:${NC} $TITLE"

# Check feature flags to see if notifications are enabled in any capacity
echo -e "${BLUE}Checking feature flags...${NC}"
FEATURE_FLAGS_RESPONSE=$(curl -s "https://gt-lax-app.web.app/feature_flags.json")

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo -e "${RED}jq is not installed. Please install it to parse feature flags.${NC}"
    echo -e "${YELLOW}See: https://stedolan.github.io/jq/download/${NC}"
    echo -e "${YELLOW}Skipping feature flag check and continuing...${NC}"
else
    # Use jq to parse the feature flags
    ENABLED=$(echo "$FEATURE_FLAGS_RESPONSE" | jq -r '.automatic_article_notifications.enabled')
    GLOBAL_ENABLED=$(echo "$FEATURE_FLAGS_RESPONSE" | jq -r '.automatic_article_notifications.global_enabled')
    ALLOWED_TOKENS_COUNT=$(echo "$FEATURE_FLAGS_RESPONSE" | jq -r '.automatic_article_notifications.allowed_tokens | length')

    echo -e "${BLUE}Feature Flag Status:${NC}"
    echo -e "  Enabled: $ENABLED"
    echo -e "  Globally Enabled: $GLOBAL_ENABLED"
    echo -e "  Allowed Tokens: $ALLOWED_TOKENS_COUNT"

    # The feature is considered active if it's enabled AND (globally enabled OR has specific tokens)
    if [[ "$ENABLED" == "true" && ("$GLOBAL_ENABLED" == "true" || "$ALLOWED_TOKENS_COUNT" -gt 0) ]]; then
        echo -e "${GREEN}Automatic article notifications are active (either globally or for specific users).${NC}"
    else
        echo -e "${RED}Automatic article notifications are disabled.${NC}"
        echo -e "${YELLOW}Would you like to continue the simulation anyway? (y/n)${NC}"
        read -r CONTINUE
        if [[ "$CONTINUE" != "y" && "$CONTINUE" != "Y" ]]; then
            echo -e "${RED}Exiting.${NC}"
            exit 1
        fi
    fi
fi

# Send notification for the simulated article
echo -e "${BLUE}Sending notification...${NC}"
NOTIFICATION_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{\"newArticlesCount\": 1, \"articleTitles\": [\"$TITLE\"]}" \
  "https://us-central1-gt-lax-app.cloudfunctions.net/sendPushNotification")

# Check if the notification was sent successfully
if [[ "$NOTIFICATION_RESPONSE" == *"success"* ]]; then
  echo -e "${GREEN}Notification sent successfully!${NC}"
  echo -e "${GREEN}Response: $NOTIFICATION_RESPONSE${NC}"
else
  echo -e "${RED}Failed to send notification.${NC}"
  echo -e "${RED}Response: $NOTIFICATION_RESPONSE${NC}"
  
  # Provide troubleshooting information
  echo -e "${YELLOW}Troubleshooting:${NC}"
  echo -e "1. Check that your API key is correct"
  echo -e "2. Ensure the Firebase function is deployed and running"
  echo -e "3. Verify that automatic_article_notifications feature flag is enabled"
  echo -e "4. Check Firebase function logs for more details"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Simulation Complete   ${NC}"
echo -e "${BLUE}========================================${NC}"
