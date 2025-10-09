require('dotenv').config({ path: process.env.VIBE_DOTENV || '.env' });
const { Command } = require('commander');
const chalk = require('./utils/chalk');
const pkg = require('../package.json');

require('./services/error-handler');
const { showBanner } = require('./utils/banner');

const registerInit = require('./commands/init');
const registerAsk = require('./commands/ask');
const registerRun = require('./commands/run');
const registerSave = require('./commands/save');
const registerVibe = require('./commands/vibe');

async function main(argv = process.argv) {
  const program = new Command();

  showBanner();

  program
    .name('vibe')
    .description('Vibe Coding AI Agent CLI')
    .version(pkg.version, '-v, --version', 'Display version information')
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true
    });

  registerInit(program);
  registerAsk(program);
  registerRun(program);
  registerSave(program);
  registerVibe(program);

  program
    .hook('preAction', () => {
      process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    })
    .exitOverride((err) => {
      if (err.code === 'commander.helpDisplayed') {
        process.exit(0);
      }
      throw err;
    });

  program
    .arguments('<command>')
    .action(() => {
      program.outputHelp();
      console.log(`\n${chalk.yellow('Tip:')} run ${chalk.cyan('vibe --help')} to see all commands.`);
    });

  await program.parseAsync(argv);
}

if (require.main === module) {
  main().catch((err) => {
    if (err?.exitCode !== undefined) {
      process.exit(err.exitCode);
    }
    console.error(err);
    process.exit(1);
  });
}

module.exports = main;

