import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { getLoadContext } from './load-context';

export default defineConfig({
  test: {
    globals: true,
    alias: {
    },
  },
  plugins: [
    /*
      NOTE:
      `getLoadContext` などの関数をプロキシに渡すときは, TSConfig の Path Alias が正しく機能しない.
      そのため, `remix vite:dev` コマンドの前に `tsx` パッケージの `NODE_OPTIONS` を使って正しくパスを解決するようにした.
      see: {@link package.json#scripts.dev}
      ref: https://github.com/remix-run/remix/issues/9171#issuecomment-2119120941
     */
    tsconfigPaths(),
    remixCloudflareDevProxy({ getLoadContext }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
  ssr: {
    noExternal: ['restyle'],
  },
});
