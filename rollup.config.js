import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/storeage.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/storeage.umd.js',
      format: 'umd',
      name: 'Storeage',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      declaration: true,
      declarationDir: 'dist',
    }),
    terser(),
  ],
};
