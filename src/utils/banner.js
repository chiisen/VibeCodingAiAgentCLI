const chalk = require('./chalk');

const BANNER_LINES = [
  ' __      ___ _           ______           _ _           _           ',
  ' \\ \\    / (_) |         |  ____|         (_) |         | |          ',
  '  \\ \\  / / _| |__  _ __ | |__   _ __ ___  _| | ___  ___| |__   ___  ',
  '   \\ \\/ / | | \'_ \\| \'__||  __| | \'_ ` _ \\| | |/ _ \\/ __| \'_ \\ / _ \\ ',
  '    \\  /  | | |_) | |   | |____| | | | | | | |  __/ (__| | | |  __/ ',
  '     \\/   |_|_.__/|_|   |______|_| |_| |_|_|_|\\___|\\___|_| |_|\\___| ',
  '                        V i b e   C o d i n g   A I   C L I         '
];

const accentPalette = [
  chalk.magentaBright,
  chalk.cyanBright,
  chalk.blueBright,
  chalk.magenta,
  chalk.cyan,
  chalk.blue,
  chalk.whiteBright
];

function showBanner() {
  const coloredLines = BANNER_LINES.map((line, index) => {
    const painter = accentPalette[index % accentPalette.length];
    return painter(line);
  });

  console.log('');
  console.log(coloredLines.join('\n'));
  console.log(chalk.dim('\n  Welcome back, let’s ship something brilliant.\n'));
}

module.exports = {
  showBanner
};
