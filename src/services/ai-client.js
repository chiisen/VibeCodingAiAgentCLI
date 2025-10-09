const path = require('path');
const fs = require('fs');
const Mustache = require('mustache');
const { loadConfig } = require('./config-store');

const templateCache = new Map();

function loadTemplate(name) {
  if (templateCache.has(name)) {
    return templateCache.get(name);
  }
  const templatePath = path.join(__dirname, '..', 'templates', `${name}.mustache`);
  const template = fs.readFileSync(templatePath, 'utf8');
  templateCache.set(name, template);
  return template;
}

function extractText(result) {
  if (!result) {
    return '';
  }
  if (Array.isArray(result.output)) {
    return result.output
      .map((item) => {
        if (item.type === 'output_text') {
          return item.text;
        }
        if (item.type === 'message') {
          return item.content?.map((c) => c.text).join('\n');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  if (Array.isArray(result.choices)) {
    return result.choices
      .map((choice) => choice.message?.content || choice.text)
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return result.toString();
}

class OpenAIClient {
  constructor({ apiKey, baseUrl, model }) {
    // Lazy require so CLI still works without installing deps until runtime
    const OpenAI = require('openai');
    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl
    });
    this.model = model;
  }

  async ask({ prompt, context }) {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content: context || 'You are Vibe Coding, an energetic coding companion.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    return extractText(response);
  }

  async generateCode({ prompt, language = 'javascript' }) {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content: `You respond with only runnable ${language} code blocks without commentary. If additional explanation is needed, add it as inline comments.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    return extractText(response);
  }
}

class MockAIClient {
  constructor({ model }) {
    this.model = model;
  }

  async ask({ prompt }) {
    const template = loadTemplate('mock-ask');
    const suggestions = [
      'Break large problems into smaller experiments',
      'Write a quick unit test before refactoring',
      'Document any non-obvious behavior for your teammates'
    ];
    return Mustache.render(template, {
      prompt,
      model: this.model,
      suggestions,
      tip: 'Run vibe init to connect your real OpenAI key.'
    });
  }

  async generateCode({ prompt }) {
    const template = loadTemplate('mock-run');
    return Mustache.render(template, {
      prompt,
      model: this.model
    });
  }
}

function createAIClient(options = {}) {
  const config = loadConfig();
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY || config.apiKey;
  const baseUrl = options.baseUrl || process.env.OPENAI_BASE_URL || config.baseUrl;
  const model = options.model || config.model;
  const forceMock = options.forceMock || process.env.VIBE_FORCE_MOCK === '1';

  if (!apiKey || forceMock) {
    return new MockAIClient({ model });
  }

  try {
    return new OpenAIClient({ apiKey, baseUrl, model });
  } catch (error) {
    if (process.env.VIBE_DEBUG) {
      console.error('Falling back to mock AI client:', error.message);
    }
    return new MockAIClient({ model });
  }
}

module.exports = {
  createAIClient
};
