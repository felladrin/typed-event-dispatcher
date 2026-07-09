#!/bin/bash
set -e

# Save current TypeScript version
CURRENT_TS_VERSION=$(node -p "require('./package.json').devDependencies.typescript")

# Install TypeScript 6.0.3 for TypeDoc compatibility
npm install typescript@6.0.3 --save-dev --silent

# Run TypeDoc
npx typedoc src/typed-event-dispatcher.ts

# Restore TypeScript 7.0.2
npm install typescript@7.0.2 --save-dev --silent

echo "Documentation generated successfully"
