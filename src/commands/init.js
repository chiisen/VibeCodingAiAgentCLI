const chalk = require('../utils/chalk');
const inquirer = require('inquirer');
const { updateConfig, loadConfig, CONFIG_FILE } = require('../services/config-store');

module.exports = function registerInit(program) {
  program
    .command('init')
    .description('Initialize Vibe Coding CLI and store your API settings')
    .option('--api-key <key>', 'OpenAI API key (overrides existing)')
    .option('--base-url <url>', 'Custom API base URL')
    .option('--model <model>', 'Default model to use')
    .action(async (options) => {
      const current = loadConfig();
      const questions = [];

      if (!options.apiKey && !current.apiKey) {
        questions.push({
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenAI API key',
          mask: '*',
          validate: (input) => input.trim() !== '' || 'API key cannot be empty'
        });
      }

      if (!options.model) {
        questions.push({
          type: 'input',
          name: 'model',
          message: `Model (${current.model})`,
          default: current.model
        });
      }

      let answers = {};
      if (questions.length) {
        answers = await inquirer.prompt(questions);
      }

      const nextConfig = updateConfig({
        apiKey: options.apiKey || answers.apiKey || current.apiKey,
        baseUrl: options.baseUrl || current.baseUrl,
        model: options.model || answers.model || current.model
      });

      console.log(`${chalk.green('?')} Configuration saved to ${chalk.cyan(CONFIG_FILE)}`);
      if (!nextConfig.apiKey) {
        console.log(`${chalk.yellow('!')} No API key stored. Use ${chalk.cyan('vibe init --api-key sk-xxx')} once you have one.`);
      }
    });
};
