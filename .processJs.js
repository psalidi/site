const {execSync} = require('child_process');
const {
  existsSync,
  mkdirpSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  lstatSync,
  writeFileSync,
} = require('fs-extra');
const {resolve} = require('path');
const {yellow, magenta} = require('chalk');
const {async: crawl} = require('fdir');

const root = process.cwd();

const js = (input) => {
  if (!input || input === true) {
    console.log('no path?');
    return;
  }

  if (!existsSync(resolve(process.cwd(), 'assets'))) {
    mkdirpSync(resolve(process.cwd(), 'assets'));
  }

  // input is Directory
  if (lstatSync(resolve(process.cwd(), input)).isDirectory()) {
    crawl(resolve(process.cwd(), input)).then((results) => {
      results.forEach((r) => {
        if (!r.endsWith('.js')) {
          return;
        }

        const outputFile = r.replace('.js', '.min.js').replace('assets_src', 'assets');
        execSync(`npx rollup --config rollup.config.js ${r} -o ${outputFile}`);
      });
    });
  }
};

js('assets_src');
