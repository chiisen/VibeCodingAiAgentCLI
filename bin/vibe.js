#!/usr/bin/env node

const main = require('../src/index');

main().catch((err) => {
  if (err?.exitCode !== undefined) {
    process.exit(err.exitCode);
  }
  console.error(err);
  process.exit(1);
});

