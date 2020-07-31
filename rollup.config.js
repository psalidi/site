import {terser} from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import fs from 'fs';

const pkgContent = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'}));

module.exports = {
  output: {
    format: 'es',
  },
  plugins: [
    replace({
      '{{version}}': pkgContent.version,
      delimiters: ['', ''],
    }),
    nodeResolve(),
    terser(),
  ],
};
