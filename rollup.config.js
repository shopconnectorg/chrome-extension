import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs'
import css from 'rollup-plugin-import-css';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'

export default {
  input: 'public/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    // always put chromeExtension() before other plugins
    chromeExtension(),
    simpleReloader(),
    // the plugins below are optional
    css(),
    image(),
    json(),
    resolve(),
    nodeResolve({
       extensions: ['.js', '.jsx']
    }),
    babel({
       babelHelpers: 'bundled',
       presets: ['@babel/preset-react'],
       extensions: ['.js', '.jsx']
    }),
    commonjs(),
    replace({
       preventAssignment: false,
       'process.env.NODE_ENV': '"development"'
    })
  ],
}
