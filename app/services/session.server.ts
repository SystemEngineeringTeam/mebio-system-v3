import type { SessionStorage } from '@remix-run/cloudflare';
import { createCookieSessionStorage } from '@remix-run/cloudflare';

let sessionStorage: SessionStorage;

export function getSessionStorage(sessionSecret: string) {
  if (sessionStorage !== undefined) {
    return sessionStorage;
  }

  sessionStorage
  = createCookieSessionStorage({
      cookie: {
        name: '__session',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        // eslint-disable-next-line dot-notation
        secure: process.env['NODE_ENV'] === 'production',
      },
    });

  return sessionStorage;
}
