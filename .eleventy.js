const htmlmin = require('html-minifier');
const fs = require('fs');
const { DateTime } = require('luxon');
const { slugify } = require('transliteration');
const CleanCSS = require('clean-css');

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // Filter source file names using a glob
  eleventyConfig.addCollection('dimosieymata', function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob([`src_site/dimosieymata/*.md`]);
  });

  eleventyConfig.addCollection('drastiriotites', function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob([`src_site/drastiriotites/*.md`]);
  });
  eleventyConfig.addCollection('eggrafa', function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob([`src_site/eggrafa/*.md`]);
  });

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

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

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter('transliterate', (text) => {
    return slugify(text);
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

  // eleventyConfig.setFrontMatterParsingOptions({
  //   excerpt: true,
  //   // Optional, default is "---"
  //   excerpt_separator: "<!-- excerpt -->"
  // });

  eleventyConfig.addPassthroughCopy('src_site/js', 'live/js');
  eleventyConfig.addPassthroughCopy('src_site/css', 'live/css');
  eleventyConfig.addPassthroughCopy('src_site/attachments', 'live/attachments');
  eleventyConfig.addPassthroughCopy('src_site/admin/config.yml');
  eleventyConfig.addPassthroughCopy('src_site/assets', 'live/assets');
  eleventyConfig.addPassthroughCopy('assets', 'live/assets');
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
