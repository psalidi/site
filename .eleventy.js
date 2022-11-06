const htmlmin = require('html-minifier');
const fs = require('fs');
const { DateTime } = require('luxon');
const { slugify } = require('transliteration');
const {execSync} = require('child_process');
const { existsSync, mkdirpSync, lstatSync } = require('fs-extra');
const {resolve} = require('path');
const {async: crawl} = require('fdir');

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

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // Filter source file names using a glob
  eleventyConfig.addCollection('dimosieymata', (collection) => collection.getFilteredByGlob([`src_site/dimosieymata/*.md`]));
  eleventyConfig.addCollection('drastiriotites', (collection) => collection.getFilteredByGlob([`src_site/drastiriotites/*.md`]));
  eleventyConfig.addCollection('eggrafa', (collection) => collection.getFilteredByGlob([`src_site/eggrafa/*.md`]));
  // Get only content that matches a tag
  eleventyConfig.addCollection("tags", (collection) => [...collection.getFilteredByGlob([`src_site/drastiriotites/*.md`]), ...collection.getFilteredByGlob([`src_site/eggrafa/*.md`])]);

  eleventyConfig.addFilter('readableDate', (dateObj) => DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy'));
  eleventyConfig.addFilter('htmlDateString', (dateObj) => DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd'));
  eleventyConfig.addFilter('cssmin', (code) => code); // new CleanCSS({}).minify(code).styles;
  eleventyConfig.addFilter('transliterate', (text) => slugify(text));

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('inlineCss', (path) => {
    let cssCached;
    if (fs.existsSync(`${process.cwd()}/src_site/${path}`)) {
      cssCached = fs.readFileSync(`${process.cwd()}/src_site/${path}`, {
        encoding: 'utf8',
      });
    } else {
      console.log('Crap');
    }
    return cssCached;
  });

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy('src_site/js', 'live/js');
  eleventyConfig.addPassthroughCopy('src_site/css', 'live/css');
  eleventyConfig.addPassthroughCopy('src_site/attachments', 'live/attachments');
  eleventyConfig.addPassthroughCopy('src_site/admin/config.yml');
  eleventyConfig.addPassthroughCopy('src_site/assets', 'live/assets');
  eleventyConfig.addPassthroughCopy('assets', 'live/assets');

  eleventyConfig.on('eleventy.before', async () => {
    css('assets_src');
    js('assets_src');
  });

  return {
    pathPrefix: '/',
    passthroughFileCopy: true,
    dir: {
      data: '_data',
      input: 'src_site',
      output: 'live',
    },
  };
};
