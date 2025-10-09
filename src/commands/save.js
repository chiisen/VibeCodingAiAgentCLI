const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const { getLastInteraction } = require('../services/config-store');

function timestamp() {
  const now = new Date();
  return now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .split('.')[0];
}

module.exports = function registerSave(program) {
  program
    .command('save')
    .description('Save your last Vibe Coding interaction to a markdown file')
    .option('-f, --file <path>', 'Custom output file name (default: vibe-session-<timestamp>.md)')
    .option('-d, --dir <path>', 'Directory to place the file in', '.')
    .action((options) => {
      const last = getLastInteraction();
      if (!last) {
        console.log(chalk.yellow('No previous interaction found. Run vibe ask or vibe run first.'));
        return;
      }

      const filename = options.file || `vibe-session-${timestamp()}.md`;
      const targetPath = path.resolve(options.dir || '.', filename);
      const templatePath = path.join(__dirname, '..', 'templates', 'session-summary.mustache');
      const template = fs.readFileSync(templatePath, 'utf8');

      const content = Mustache.render(template, {
        ...last,
        model: last.model || 'default',
        createdAt: last.createdAt || new Date().toISOString()
      });

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, content, 'utf8');

      console.log(`${chalk.green('✔')} Saved session to ${chalk.cyan(targetPath)}`);
    });
};
