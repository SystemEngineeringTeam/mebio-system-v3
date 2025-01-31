/* eslint-disable no-restricted-imports */

import type { createPagesFunctionHandlerParams } from '@remix-run/cloudflare-pages';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
// @ts-expect-error ビルドされたら解決されるので無視
import * as build from '../build/server';
import { getLoadContext } from '../load-context';

export const onRequest = createPagesFunctionHandler(
  { build, getLoadContext } as unknown as createPagesFunctionHandlerParams<any>,
);
