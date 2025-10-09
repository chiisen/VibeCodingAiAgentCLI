const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function makeTempFileName(extension) {
  const id = crypto.randomBytes(6).toString('hex');
  return path.join(os.tmpdir(), `vibe-${Date.now()}-${id}${extension}`);
}

function runJavascript(code, options = {}) {
  const extension = options.useModule ? '.mjs' : '.cjs';
  const filePath = makeTempFileName(extension);
  const normalized = code.endsWith('\n') ? code : `${code}\n`;
  const wrapped = options.useModule ? normalized : `'use strict';\n${normalized}`;

  fs.writeFileSync(filePath, wrapped, 'utf8');

  const execArgs = options.execArgs || [];
  const spawnOptions = {
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env },
    timeout: options.timeout || 8000,
    maxBuffer: options.maxBuffer || 1024 * 1024,
    encoding: 'utf8'
  };

  const result = spawnSync(process.execPath, execArgs.concat(filePath), spawnOptions);

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    if (process.env.VIBE_DEBUG) {
      console.error('Failed to remove temp file', filePath, err.message);
    }
  }

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
    signal: result.signal,
    error: result.error
  };
}

module.exports = {
  runJavascript
};
