const {execSync} = require('child_process');
const {existsSync, mkdirpSync, lstatSync} = require('fs-extra');
const {resolve} = require('path');
const {async: crawl} = require('fdir');
// const crypto = require('crypto');

const root = process.cwd();

const css = (input) => {
  // input is Directory
  if (lstatSync(resolve(process.cwd(), input)).isDirectory()) {
    crawl(resolve(process.cwd(), input)).then((results) => {
      results.forEach((r) => {
        const x = r.split('/');
        if (!r.endsWith('css') || x[x.length - 1].startsWith('_')) {
          return;
        }

        if (!existsSync(resolve(process.cwd(), 'assets/css'))) {
          mkdirpSync(resolve(process.cwd(), 'assets/css'));
        }

        // postcss [input.css] [OPTIONS] [-o|--output output.css] [--watch|-w]
        execSync(
          `npx postcss ${r} -o ${r
            .replace('.css', '.min.css')
            .replace('assets_src', 'assets')}`
        );
      });
    });
  }
};

css('assets_src');
