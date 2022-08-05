import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './static/js/index.js',
  output: {
    file: './static/dist/bundle.js',
    format: 'cjs',
    sourcemap: true,
    strict: true,
    compact: true,
    minifyInternalExports: true,
  },
  watch: {
    include: './static/js/**',
    clearScreen: false,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    babel({
      include: ['**.js', 'node_modules/**'],
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
    }),
    terser(),
  ],
};
