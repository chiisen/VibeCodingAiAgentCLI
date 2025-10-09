process.on('unhandledRejection', (reason) => {
  if (process.env.VIBE_DEBUG) {
    console.error('[vibe] Unhandled rejection:', reason);
  } else {
    console.error('\u274c  Something went wrong:', reason && reason.message ? reason.message : reason);
  }
  process.exitCode = 1;
});

process.on('uncaughtException', (err) => {
  console.error('\u274c  Unexpected error:', err.message);
  if (process.env.VIBE_DEBUG) {
    console.error(err.stack);
  }
  process.exit(1);
});
