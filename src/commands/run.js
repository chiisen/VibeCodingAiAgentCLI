const chalk = require('../utils/chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { createAIClient } = require('../services/ai-client');
const { pushHistory } = require('../services/config-store');
const { runJavascript } = require('../utils/sandbox');

function extractCode(response) {
  if (!response) {
    return '';
  }
  const fenced = response.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  if (fenced && fenced[1]) {
    return fenced[1].trim();
  }
  return response.trim();
}

module.exports = function registerRun(program) {
  program
    .command('run [prompt...]')
    .description('Ask Vibe for runnable code and execute it in a sandbox')
    .option('-m, --model <model>', 'Override the default model')
    .option('--mock', 'Force the built-in mock AI client', false)
    .option('--timeout <ms>', 'Sandbox timeout in milliseconds', (value) => parseInt(value, 10), 8000)
    .option('--show-code', 'Print the generated code before running', false)
    .action(async (promptParts, options) => {
      let prompt = (promptParts || []).join(' ').trim();

      if (!prompt) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'prompt',
            message: 'Describe the snippet you want to run',
            validate: (input) => input.trim() !== '' || 'Prompt cannot be empty'
          }
        ]);
        prompt = answers.prompt.trim();
      }

      const spinner = ora('Generating code...').start();

      try {
        const client = createAIClient({ model: options.model, forceMock: options.mock });
        const response = await client.generateCode({ prompt });
        const code = extractCode(response);

        if (!code) {
          spinner.fail('AI did not return runnable code');
          process.exitCode = 1;
          return;
        }

        spinner.text = 'Executing snippet...';

        if (options.showCode) {
          spinner.stop();
          console.log(`\n${chalk.magenta('Generated code:')}\n${chalk.gray(code)}\n`);
          spinner.start('Running snippet...');
        }

        const runResult = runJavascript(code, { timeout: options.timeout });

        if (runResult.error) {
          spinner.fail('Sandbox execution failed');
          console.error(chalk.red(runResult.error.message || runResult.error));
          process.exitCode = 1;
          return;
        }

        spinner.succeed('Execution finished');

        if (runResult.stdout) {
          console.log(`${chalk.green('stdout')}\n${runResult.stdout}`);
        }
        if (runResult.stderr) {
          console.log(`${chalk.yellow('stderr')}\n${runResult.stderr}`);
        }
        if (runResult.status !== 0) {
          console.log(chalk.red(`Process exited with status ${runResult.status}`));
        }

        pushHistory({
          type: 'run',
          prompt,
          code,
          stdout: runResult.stdout,
          stderr: runResult.stderr,
          status: runResult.status,
          model: options.model || undefined
        });
      } catch (error) {
        spinner.fail('Failed to generate or execute code');
        console.error(chalk.red(error.message));
        if (process.env.VIBE_DEBUG) {
          console.error(error.stack);
        }
        process.exitCode = 1;
      }
    });
};
