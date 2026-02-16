#!/bin/bash

# Script to run Docker with different environments
# Usage: ./run_docker.sh [dev|uat|prod]

ENV_MODE=${1:-dev}

if [ "$ENV_MODE" = "prod" ]; then
    echo "Starting in PRODUCTION mode..."
    export NODE_ENV=production
elif [ "$ENV_MODE" = "uat" ]; then
    echo "Starting in UAT mode..."
    # UAT usually runs as a production build but might use different API endpoints
    export NODE_ENV=production
    export APP_ENV=uat
else
    echo "Starting in DEVELOPMENT mode..."
    # Note: The current Dockerfile is a multi-stage build optimized for production.
    # Running with NODE_ENV=development might require a different Dockerfile or target for true dev experience (hot-reload).
    # For now, we set it to development to load dev configs if any.
    export NODE_ENV=development
fi

echo "Application is running with NODE_ENV: $NODE_ENV"

# Run docker compose
# We use --build to ensure changes are picked up and --force-recreate to ensure env vars are applied
docker compose up -d --build --force-recreate
