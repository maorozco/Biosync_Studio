#!/bin/bash
# Runs after every git pull / merge in Replit.
# 1. Keeps workspace deps in sync so imports like `driver.js` resolve.
# 2. Pushes DB schema only when DATABASE_URL is set (mock mode skips it).
set -e

pnpm install --frozen-lockfile

if [ -n "$DATABASE_URL" ]; then
  echo "post-merge: DATABASE_URL set, pushing DB schema"
  pnpm --filter db push
else
  echo "post-merge: DATABASE_URL not set, skipping DB schema push (mock mode)"
fi
