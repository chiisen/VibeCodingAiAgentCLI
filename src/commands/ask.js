const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { createAIClient } = require('../services/ai-client');
const { pushHistory } = require('../services/config-store');

module.exports = function registerAsk(program) {
  program
    .command('ask [prompt...]')
    .description('Ask Vibe Coding for guidance and ideas')
    .option('-m, --model <model>', 'Override the default model')
    .option('--mock', 'Force the built-in mock AI client', false)
    .option('--raw', 'Print the raw response without styling', false)
    .action(async (promptParts, options) => {
      let prompt = (promptParts || []).join(' ').trim();

      if (!prompt) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'prompt',
            message: 'What do you want to build or debug?',
            validate: (input) => input.trim() !== '' || 'Prompt cannot be empty'
          }
        ]);
        prompt = answers.prompt.trim();
      }

      const spinner = ora('Talking with Vibe...').start();

      try {
        const client = createAIClient({ model: options.model, forceMock: options.mock });
        const response = await client.ask({ prompt });
        spinner.succeed('Response ready');

        if (options.raw) {
          console.log(response);
        } else {
          console.log(`\n${chalk.cyan.bold('Vibe says:')}\n${chalk.white(response)}\n`);
        }

        pushHistory({
          type: 'ask',
          prompt,
          response,
          model: options.model || undefined
        });
      } catch (error) {
        spinner.fail('Failed to get a response');
        console.error(chalk.red(error.message));
        if (process.env.VIBE_DEBUG) {
          console.error(error.stack);
        }
        process.exitCode = 1;
      }
    });
};
