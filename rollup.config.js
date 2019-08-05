import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const external = id => !id.startsWith('.') && !id.startsWith('/');

const input = 'src/index.ts';

const buildUmd = {
  input,
  output: [
    {
      name: 'MusicVisualization',
      file: pkg.main,
      format: 'umd',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs(),
    terser({
      sourcemap: true,
      output: { comments: false },
      warnings: true,
      ecma: 5,
      toplevel: false
    })
  ]
};

const buildEs = {
  input,
  external,
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs()
  ]
};

export default [buildUmd, buildEs];
