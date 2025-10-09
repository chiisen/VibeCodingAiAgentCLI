const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const CONFIG_DIR = path.join(os.homedir(), '.vibe');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');

const DEFAULT_CONFIG = {
  apiKey: null,
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  historyLimit: 20
};

function ensureStorage() {
  fs.ensureDirSync(CONFIG_DIR);
}

function loadConfig() {
  ensureStorage();
  if (!fs.existsSync(CONFIG_FILE)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const data = fs.readJsonSync(CONFIG_FILE, { throws: false }) || {};
    return { ...DEFAULT_CONFIG, ...data };
  } catch (error) {
    if (process.env.VIBE_DEBUG) {
      console.error('Failed to read config file', error);
    }
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(config) {
  ensureStorage();
  fs.writeJsonSync(CONFIG_FILE, { ...DEFAULT_CONFIG, ...config }, { spaces: 2 });
}

function updateConfig(patch) {
  const current = loadConfig();
  const next = { ...current, ...patch };
  saveConfig(next);
  return next;
}

function loadHistory() {
  ensureStorage();
  if (!fs.existsSync(HISTORY_FILE)) {
    return [];
  }
  try {
    return fs.readJsonSync(HISTORY_FILE, { throws: false }) || [];
  } catch (error) {
    if (process.env.VIBE_DEBUG) {
      console.error('Failed to read history file', error);
    }
    return [];
  }
}

function pushHistory(entry) {
  const config = loadConfig();
  const history = loadHistory();
  history.unshift({ ...entry, createdAt: new Date().toISOString() });
  const limited = history.slice(0, config.historyLimit || DEFAULT_CONFIG.historyLimit);
  fs.writeJsonSync(HISTORY_FILE, limited, { spaces: 2 });
  return limited[0];
}

function getLastInteraction() {
  const [latest] = loadHistory();
  return latest || null;
}

module.exports = {
  CONFIG_DIR,
  CONFIG_FILE,
  HISTORY_FILE,
  loadConfig,
  saveConfig,
  updateConfig,
  loadHistory,
  pushHistory,
  getLastInteraction
};
