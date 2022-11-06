const terser = require('@rollup/plugin-terser');
const replace = require('@rollup/plugin-replace');
const {nodeResolve}  = require('@rollup/plugin-node-resolve');
const fs = require('fs');

const pkgContent = require('./package.json');

module.exports = {
  output: {
    format: 'es',
  },
  plugins: [
    replace({
      '{{version}}': pkgContent.version,
      delimiters: ['', ''],
      preventAssignment: true
    }),
    nodeResolve(),
    terser(),
  ],
};
