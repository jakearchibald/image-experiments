/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import del from 'del';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import simpleTS from './lib/simple-ts';
import clientBundlePlugin from './lib/client-bundle-plugin';
import nodeExternalPlugin from './lib/node-external-plugin';
import cssPlugin from './lib/css-plugin';
import assetPlugin from './lib/asset-plugin';
import assetStringPlugin from './lib/asset-string-plugin';
import resolveDirsPlugin from './lib/resolve-dirs-plugin';
import entryURLPlugin from './lib/entry-url-plugin';
import runScript from './lib/run-script';

const publicPath =
  process.env.NODE_ENV === 'production' ? '/image-experiments/' : '/';

function resolveFileUrl({ fileName }) {
  return JSON.stringify(fileName.replace(/^static\//, publicPath));
}

export default async function ({ watch }) {
  await del('.tmp/build');

  const tsPluginInstance = simpleTS('static-build', { watch });
  const commonPlugins = () => [
    tsPluginInstance,
    resolveDirsPlugin(['static-build', 'client', 'shared', 'client-worker']),
    assetPlugin(),
    assetStringPlugin(),
    cssPlugin(),
    entryURLPlugin(),
  ];
  const dir = '.tmp/build';
  const staticPath = 'static/[name]-[hash][extname]';

  return {
    input: 'static-build/index.tsx',
    output: {
      dir,
      format: 'cjs',
      assetFileNames: staticPath,
      exports: 'named',
    },
    // Don't watch the ts files. Instead we watch the output from the ts compiler.
    watch: { clearScreen: false, exclude: ['**/*.ts', '**/*.tsx'] },
    preserveModules: true,
    plugins: [
      { resolveFileUrl },
      clientBundlePlugin(
        {
          plugins: [
            { resolveFileUrl },
            ...commonPlugins(),
            resolve(),
            terser({ module: true }),
          ],
        },
        {
          dir,
          format: 'esm',
          chunkFileNames: staticPath.replace('[extname]', '.js'),
          entryFileNames: staticPath.replace('[extname]', '.js'),
        },
        resolveFileUrl,
      ),
      ...commonPlugins(),
      nodeExternalPlugin(),
      runScript(dir + '/index.js'),
    ],
  };
}
