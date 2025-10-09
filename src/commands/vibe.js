const chalk = require('chalk');
const ora = require('ora');
const { createAIClient } = require('../services/ai-client');

const PRESETS = {
  flow: {
    banner: [
      '  __   __ _ _             ',
      ' / _| / _(_) | ___  ___ ',
      '| |_ | |_| | |/ _ \\ \__/ ',
      '|  _||  _| | |  __/\\__ \\',
      '|_|  |_| |_|_|\\___||___/',
      '       Vibe Coding Flow'
    ],
    messages: [
      'You are in the groove. Keep shipping.',
      'Breathe, refactor, and glide through the sprint.',
      'Momentum feels good—capture it in a commit.'
    ]
  },
  chill: {
    banner: [
      '--------------------',
      '--  chill  mode  --',
      '--------------------'
    ],
    messages: [
      'Step back, stretch, let the ideas simmer.',
      'Take five, sketch the architecture, return sharp.',
      'Keyboard break now equals fewer bugs later.'
    ]
  },
  hype: {
    banner: [
      ' __  __           _ ',
      '|  \\| | ___   ___| |',
      '| .` |/ _ \\ / __| |',
      '| |\\ | (_) | (__| |',
      '|_| \\_|\\___/ \\___|_|',
      '   Vibe Coding Hype'
    ],
    messages: [
      'Deploy the feature. Today is the day.',
      'High-five your future self—they love this release.',
      'Turn up the playlist and push that pull request.'
    ]
  }
};

function pickPreset(mood) {
  return PRESETS[mood] || PRESETS.flow;
}

function pickMessage(list) {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = function registerVibe(program) {
  program
    .command('vibe')
    .description('Trigger an energetic Vibe Coding moment')
    .option('--mood <mood>', 'flow | chill | hype', 'flow')
    .option('--use-ai', 'Ask the AI to craft the vibe message', false)
    .action(async (options) => {
      const preset = pickPreset(options.mood);
      let message = pickMessage(preset.messages);

      if (options.useAi) {
        const spinner = ora('Asking Vibe for a custom mantra...').start();
        try {
          const client = createAIClient({ forceMock: false });
          const aiMessage = await client.ask({
            prompt: `Give me a one-line ${options.mood} mantra for software makers. Use plain ASCII characters.`,
            context: 'Keep it short, inspiring, and developer focused.'
          });
          if (aiMessage) {
            message = aiMessage.split('\n')[0];
          }
          spinner.succeed('Fresh vibe acquired');
        } catch (error) {
          spinner.fail('Falling back to offline vibe');
          if (process.env.VIBE_DEBUG) {
            console.error(error);
          }
        }
      }

      const color = options.mood === 'hype' ? chalk.redBright : options.mood === 'chill' ? chalk.blueBright : chalk.magenta;
      console.log('');
      preset.banner.forEach((line) => console.log(color(line)));
      console.log(`\n${chalk.bold(message)}\n`);
    });
};
